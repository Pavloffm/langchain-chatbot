import {useEffect, useState} from "react";
import type {ChatSummary, Message} from "./types/chat";
import ChatLayout from "./components/chat/ChatLayout.tsx";

export default function App() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [threadId, setThreadId] = useState<string>(() => crypto.randomUUID());
    const [chats, setChats] = useState<ChatSummary[]>([]);
    const [isSending, setIsSending] = useState(false);

    useEffect(() => {
        const loadChats = async () => {
            const response = await fetch("/api/chats");

            if (!response.ok) {
                throw new Error("Unable to load chats");
            }

            setChats(await response.json());
        };

        loadChats().catch(console.error);
    }, []);

    const selectChat = async (selectedThreadId: string) => {
        const response = await fetch(`/api/chats/${selectedThreadId}`);

        if (!response.ok) {
            throw new Error("Unable to load chat");
        }

        const chat = await response.json();

        setThreadId(selectedThreadId);
        setMessages(chat.messages);
        setInput("");
    };

    const send = async () => {
        if (isSending) return;
        const content = input.trim();
        if (!content) return;

        setIsSending(true);

        const userMessage: Message = {
            role: "user",
            content,
        };

        try {
            setMessages((previous) => [
                ...previous,
                userMessage,
                {role: "bot", content: ""},
            ]);
            setInput("");

            const response = await fetch("/api/chat", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    message: content,
                    thread_id: threadId,
                }),
            });

            if (!response.ok || !response.body) {
                throw new Error("Unable to stream response");
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            while (true) {
                const {value, done} = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, {stream: true});

                setMessages((previous) => {
                    const updated = [...previous];
                    const lastMessage = updated[updated.length - 1];

                    updated[updated.length - 1] = {
                        ...lastMessage,
                        content: lastMessage.content + chunk,
                    };

                    return updated;
                });
            }
        } finally {
            setIsSending(false);
        }
    };

    const newChat = () => {
        setMessages([]);
        setInput("");
        setThreadId(crypto.randomUUID());
    };


    return (
        <ChatLayout
            chats={chats}
            messages={messages}
            input={input}
            onInputChange={setInput}
            onSend={send}
            onNewChat={newChat}
            onSelectChat={selectChat}
            isSending={isSending}
        />
    );
}
