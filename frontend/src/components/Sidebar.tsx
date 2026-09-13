import type {ChatSummary} from "../types/chat.ts";

type SidebarProps = {
  chats: ChatSummary[];
  onNewChat: () => void;
  onSelectChat: (threadId: string) => void;
};


export default function Sidebar({
  chats,
  onNewChat,
  onSelectChat,
}: SidebarProps) {
  return (
    <aside className="sidebar">
      <button type="button" onClick={onNewChat}>
        New chat
      </button>

      <h2>Previous chats</h2>

      <nav>
        {chats.map((chat) => (
          <button
            type="button"
            key={chat.thread_id}
            onClick={() => onSelectChat(chat.thread_id)}
          >
            {chat.thread_id}
          </button>
        ))}
      </nav>
    </aside>
  );
}