import os

import uvicorn
from dotenv import load_dotenv
from fastapi import FastAPI
from pydantic import BaseModel
from starlette.responses import StreamingResponse

from llm import get_stream_answer

load_dotenv()
app = FastAPI(
    title="Chatbot App",
    description="Modern chatbot built with LangChain",
    version="0.0.1"
)


class ChatRequest(BaseModel):
    message: str


@app.post("/chat")
async def chat(request: ChatRequest):
    return StreamingResponse(
        get_stream_answer(request.message),
    )


if __name__ == "__main__":
    port = int(os.getenv("PORT", "8082"))
    uvicorn.run(app, host="0.0.0.0", port=port)
