import ChatInput from "../ui/ChatInput";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "../../App.css";
import type {Message} from "../../types/chat";

type ChatWindowProps = {
    messages: Message[];
    input: string;
    onInputChange: (value: string) => void;
    onSend: () => void;
    isSending: boolean;
};

export default function ChatWindow({
                                       messages,
                                       input,
                                       onInputChange,
                                       onSend,
                                       isSending,
                                   }: ChatWindowProps) {

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
                    onChange={onInputChange}
                    onSubmit={onSend}
                    disabled={isSending}
                />
            </div>
        </div>
    );
}
