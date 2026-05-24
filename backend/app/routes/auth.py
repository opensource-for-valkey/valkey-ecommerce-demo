import uuid
import hashlib
import hmac
import secrets
import logging
from datetime import datetime, timezone
from typing import Optional

from fastapi import APIRouter, Depends, Header, HTTPException, status
from pydantic import BaseModel, Field, EmailStr

from app.valkey import get_valkey

router = APIRouter(prefix="/api/auth", tags=["auth"])
logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

SESSION_TTL = 86400 * 7   # 7 days in seconds
SALT_BYTES  = 32           # bytes for password salt


# ---------------------------------------------------------------------------
# Schema definitions
# ---------------------------------------------------------------------------

class SignupRequest(BaseModel):
    email: EmailStr = Field(..., description="User's email address")
    password: str   = Field(..., min_length=8, description="Password, minimum 8 characters")
    name: str       = Field(..., min_length=1, description="Display name")

class LoginRequest(BaseModel):
    email: EmailStr = Field(..., description="User's email address")
    password: str   = Field(..., description="Account password")

class AuthResponse(BaseModel):
    userId:    str
    name:      str
    email:     str
    token:     str
    expiresAt: str

class UserProfile(BaseModel):
    userId:    str
    name:      str
    email:     str
    createdAt: str

class LogoutResponse(BaseModel):
    message: str


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _hash_password(password: str, salt: str) -> str:
    """SHA-256 HMAC hash of password using salt as key."""
    return hmac.new(
        salt.encode(),
        password.encode(),
        hashlib.sha256
    ).hexdigest()


def _generate_session_token() -> str:
    return secrets.token_hex(32)


def get_current_user(
    authorization: Optional[str] = Header(None),
    r=Depends(get_valkey)
) -> str:
    """
    Extracts and validates a Bearer token from the Authorization header.
    Returns the user_id if the session is valid; raises 401 otherwise.

    Usage in other routes:
        user_id: str = Depends(get_current_user)
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or malformed Authorization header. Expected: Bearer <token>",
        )

    token = authorization.split(" ", 1)[1].strip()
    session_key = f"session:{token}"
    user_id = r.get(session_key)

    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired session token.",
        )

    # Slide the expiry window on activity
    r.expire(session_key, SESSION_TTL)
    return user_id


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@router.post("/signup", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def signup(req: SignupRequest, r=Depends(get_valkey)):
    """
    Register a new user account.

    - Stores user data as a Valkey JSON doc at key  user:<uuid>
    - Maintains an email → user_id index at  user_email:<email>
    - Returns a session token immediately (no separate login step needed)
    """
    email_lower = req.email.lower()
    email_index_key = f"user_email:{email_lower}"

    # Check uniqueness
    if r.exists(email_index_key):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists.",
        )

    # Hash password
    salt       = secrets.token_hex(SALT_BYTES)
    pw_hash    = _hash_password(req.password, salt)
    user_id    = f"user:{uuid.uuid4()}"
    now_iso    = datetime.now(timezone.utc).isoformat()

    user_doc = {
        "id":           user_id,
        "name":         req.name,
        "email":        email_lower,
        "passwordHash": pw_hash,
        "salt":         salt,
        "createdAt":    now_iso,
        "updatedAt":    now_iso,
    }

    # Persist user document
    r.json().set(user_id, "$", user_doc)

    # Email → user_id index (no TTL — permanent)
    r.set(email_index_key, user_id)

    # Create session
    token      = _generate_session_token()
    session_key = f"session:{token}"
    r.set(session_key, user_id, ex=SESSION_TTL)

    expires_at = datetime.now(timezone.utc).replace(
        second=0, microsecond=0
    ).isoformat()  # approximate; client should treat token as opaque

    logger.info("New user registered: %s", user_id)

    return AuthResponse(
        userId=user_id,
        name=req.name,
        email=email_lower,
        token=token,
        expiresAt=expires_at,
    )


@router.post("/login", response_model=AuthResponse)
def login(req: LoginRequest, r=Depends(get_valkey)):
    """
    Authenticate with email + password and receive a session token.
    """
    email_lower     = req.email.lower()
    email_index_key = f"user_email:{email_lower}"

    user_id = r.get(email_index_key)
    if not user_id:
        # Deliberately vague to prevent user enumeration
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    user_json = r.json().get(user_id)
    if not user_json:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="User record not found.",
        )

    user = user_json[0] if isinstance(user_json, list) else user_json

    # Constant-time password check
    expected_hash = _hash_password(req.password, user["salt"])
    if not hmac.compare_digest(expected_hash, user["passwordHash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    # Issue new session (previous sessions remain valid — useful for multi-device)
    token       = _generate_session_token()
    session_key = f"session:{token}"
    r.set(session_key, user_id, ex=SESSION_TTL)

    expires_at = datetime.now(timezone.utc).isoformat()

    logger.info("User logged in: %s", user_id)

    return AuthResponse(
        userId=user_id,
        name=user["name"],
        email=user["email"],
        token=token,
        expiresAt=expires_at,
    )


@router.get("/me", response_model=UserProfile)
def get_profile(user_id: str = Depends(get_current_user), r=Depends(get_valkey)):
    """
    Return the profile of the currently authenticated user.
    Requires:  Authorization: Bearer <token>
    """
    user_json = r.json().get(user_id)
    if not user_json:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found.",
        )

    user = user_json[0] if isinstance(user_json, list) else user_json

    return UserProfile(
        userId=user["id"],
        name=user["name"],
        email=user["email"],
        createdAt=user["createdAt"],
    )


@router.post("/logout", response_model=LogoutResponse)
def logout(
    authorization: Optional[str] = Header(None),
    r=Depends(get_valkey)
):
    """
    Invalidate the current session token.
    Silently succeeds even if the token was already expired.
    """
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ", 1)[1].strip()
        r.delete(f"session:{token}")

    return LogoutResponse(message="Logged out successfully.")