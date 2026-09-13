from typing import Iterator

from langchain_ollama import ChatOllama


def get_stream_answer(query: str) -> Iterator[str]:
    llm = ChatOllama(
        model="gemma4:e4b",
        temperature=0,
    )

    input = [
        (
            "system",
            "You are a helpful assistant that translates English to French. Translate the user sentence.",
        ),
        ("human", query),
    ]

    stream = llm.stream(input)

    for chunk in stream:
        yield chunk.content
