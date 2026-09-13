import Sidebar from "../Sidebar";
import ChatWindow from "./ChatWindow.tsx";
import type {ChatSummary, Message} from "../../types/chat.ts";

type ChatLayoutProps = {
    chats: ChatSummary[];
    messages: Message[];
    input: string;
    onInputChange: (value: string) => void;
    onSend: () => void;
    onNewChat: () => void;
    onSelectChat: (threadId: string) => void;
    isSending: boolean;
};

export default function ChatLayout({
                                       chats,
                                       messages,
                                       input,
                                       onInputChange,
                                       onSend,
                                       onNewChat,
                                       onSelectChat,
                                       isSending,
                                   }: ChatLayoutProps) {
    return (
        <main className="chat-layout">
            <Sidebar
                chats={chats}
                onNewChat={onNewChat}
                onSelectChat={onSelectChat}
            />

            <ChatWindow
                messages={messages}
                input={input}
                onInputChange={onInputChange}
                onSend={onSend}
                isSending={isSending}
            />
        </main>
    );
}