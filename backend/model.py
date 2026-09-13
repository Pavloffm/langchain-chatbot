import sqlite3
from typing import Iterator

from langchain_core.messages import SystemMessage, HumanMessage
from langchain_ollama import ChatOllama
from langgraph.checkpoint.sqlite import SqliteSaver
from langgraph.constants import START
from langgraph.graph import MessagesState, StateGraph

model = ChatOllama(
        model="gemma4:e4b",
        temperature=0,
    )

def call_model(state: MessagesState):
    messages = [
        SystemMessage(content="You are a helpful assistant."),
        *state["messages"],
    ]

    return {"messages": [model.invoke(messages)]}

connection = sqlite3.connect(
    "chat_memory.sqlite",
    check_same_thread=False,
)
checkpointer = SqliteSaver(connection)

builder = StateGraph(MessagesState)
builder.add_node("model", call_model)
builder.add_edge(START, "model")
graph = builder.compile(checkpointer=checkpointer)

def get_stream_answer(query: str, thread_id: str) -> Iterator[str]:
    config = {"configurable": {"thread_id": thread_id,}}

    for chunk, _metadata in graph.stream(
            {"messages": [HumanMessage(content=query),]},
            config=config,
            stream_mode="messages",
    ):
        yield chunk.content

