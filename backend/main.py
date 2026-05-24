from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google.adk.runners import Runner, types
from google.adk.sessions import InMemorySessionService

Content = types.Content
Part = types.Part
from orchestrator import orchestrator
from voice_router import router as voice_router
import uvicorn

app = FastAPI(title="VoiceCart AI", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(voice_router)

session_service = InMemorySessionService()
runner = Runner(
    agent=orchestrator,
    session_service=session_service,
    app_name="voicecart",
)


class ChatRequest(BaseModel):
    message: str
    session_id: str


class ChatResponse(BaseModel):
    response: str
    session_id: str


@app.get("/health")
def health():
    from valkey_client import ping
    return {"status": "ok", "valkey": ping()}


@app.post("/api/agent/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    if not req.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")
    try:
        await session_service.create_session(
            app_name="voicecart",
            user_id=req.session_id,
            session_id=req.session_id,
            state={"voicecart_session_id": req.session_id},
        )
    except Exception:
        pass  # session may already exist

    try:
        content = Content(role="user", parts=[Part(text=req.message.strip())])
        response_text = ""

        async for event in runner.run_async(
            user_id=req.session_id,
            session_id=req.session_id,
            new_message=content,
        ):
            if event.is_final_response():
                response_text = event.content.parts[0].text

        return ChatResponse(response=response_text, session_id=req.session_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
