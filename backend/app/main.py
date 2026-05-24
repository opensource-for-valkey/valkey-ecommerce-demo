import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from app.valkey import init_valkey
from app.routes import cart, checkout, auth

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup actions
    logger.info("Initializing Valkey database client and verifying connection...")
    try:
        init_valkey()
        logger.info("Valkey connection established and mock data seeded.")
    except Exception as e:
        logger.critical("Valkey initialization failed: %s", str(e))
        raise e
    yield
    # Shutdown actions
    logger.info("Shutting down FastAPI application.")

app = FastAPI(
    title="Valkey E-commerce Cart & Checkout API",
    description="A persistent shopping cart and atomic checkout system powered by FastAPI and Valkey",
    version="1.0.0",
    lifespan=lifespan
)

# Exception handler for general exceptions to format JSON errors properly
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error("Unhandled exception: %s", str(exc), exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": f"Internal Server Error: {str(exc)}"}
    )

# Include API Routers
app.include_router(auth.router)
app.include_router(cart.router)
app.include_router(checkout.router)

@app.get("/")
def read_root():
    return {
        "message": "Welcome to the Valkey E-commerce Cart & Checkout API!",
        "documentation": "/docs"
    }