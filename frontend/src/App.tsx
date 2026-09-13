import {useState} from 'react';

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
        <div style={{maxWidth: 600, margin: "40px auto"}}>
            <h1>AI Chatbot</h1>
            <div style={{minHeight: '300px', border: '1px solid #ddd', padding: 10}}>
                {messages.map((m, i) => (
                    <p key={i}><strong>{m.role}:</strong> {m.content}</p>
                ))}
            </div>
            <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && send()}
                placeholder="Type your message…"
                style={{width: '80%'}}
            />
            <button onClick={send} style={{marginLeft: 5}}>Send</button>
        </div>
    );
}