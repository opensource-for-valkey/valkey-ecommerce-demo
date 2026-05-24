from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse
from tools.voice_tools import enroll_voice, verify_voice, check_enrollment_status

router = APIRouter(prefix="/api/voice", tags=["voice-auth"])


@router.post("/enroll")
async def enroll(
    audio_file: UploadFile = File(...),
    user_id: str = Form(...),
):
    if not user_id.strip():
        raise HTTPException(status_code=400, detail="user_id is required")

    audio_bytes = await audio_file.read()
    if len(audio_bytes) == 0:
        raise HTTPException(status_code=400, detail="audio_file is empty")

    result = enroll_voice(audio_bytes, user_id.strip())
    status_code = 200 if result.get("status") == "enrolled" else 400
    return JSONResponse(content=result, status_code=status_code)


@router.post("/verify")
async def verify(
    audio_file: UploadFile = File(...),
    user_id: str = Form(...),
):
    if not user_id.strip():
        raise HTTPException(status_code=400, detail="user_id is required")

    audio_bytes = await audio_file.read()
    if len(audio_bytes) == 0:
        raise HTTPException(status_code=400, detail="audio_file is empty")

    result = verify_voice(audio_bytes, user_id.strip())
    return JSONResponse(content=result)


@router.get("/status")
async def status(user_id: str):
    if not user_id.strip():
        raise HTTPException(status_code=400, detail="user_id is required")
    return check_enrollment_status(user_id.strip())
