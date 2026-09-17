import os

import uvicorn
from dotenv import load_dotenv
from fastapi import FastAPI
from pydantic import BaseModel
from starlette.responses import StreamingResponse

from model import checkpointer, get_stream_answer, graph

load_dotenv()
app = FastAPI(
    title="Chatbot App",
    description="Modern chatbot built with LangChain",
    version="0.0.1"
)


class ChatRequest(BaseModel):
    message: str
    thread_id: str

@app.get("/chats")
def get_chats():
    thread_ids = sorted({
        checkpoint.config["configurable"]["thread_id"]
        for checkpoint in checkpointer.list(None)
    })

    return [{"thread_id": thread_id} for thread_id in thread_ids]

@app.get("/chats/{thread_id}")
def get_chat(thread_id: str):
    config = {"configurable": {"thread_id": thread_id}}
    state = graph.get_state(config)

    messages = [
        {
            "role": "user" if message.type == "human" else "bot",
            "content": message.content,
        }
        for message in state.values.get("messages", [])
    ]

    return {
        "thread_id": thread_id,
        "messages": messages,
    }

@app.post("/chat")
async def chat(request: ChatRequest):
    return StreamingResponse(
        get_stream_answer(request.message, request.thread_id,),
    )


if __name__ == "__main__":
    port = int(os.getenv("PORT", "8082"))
    uvicorn.run(app, host="0.0.0.0", port=port)
