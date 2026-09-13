import {useState} from 'react';
import ChatInput from "./components/ui/ChatInput";
import "./App.css";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function Home() {

    const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
    const [input, setInput] = useState("");

    const send = async () => {
        if (!input.trim()) return;
        const userMsg = {role: "user", content: input};
        const botMsg = {role: "bot", content: ""};
        setMessages([...messages, userMsg, botMsg]);
        setInput("");

        const response = await fetch("/api/chat", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({message: userMsg.content}),
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
                    role: "bot",
                    content: lastMessage.content + chunk,
                };
                return updated;
            });
        }
    };

    return (
        <div className="chat-app">
            <div className="chat-messages">
                {messages.map((m, i) => (
                    <div className="message" key={i}>
                        <strong>{m.role}:</strong>
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {m.content}
                        </ReactMarkdown>
                    </div>
                ))}
            </div>
            <div className="chat-composer">
                <ChatInput
                    value={input}
                    onChange={setInput}
                    onSubmit={send}
                />
            </div>
        </div>
    );
}
