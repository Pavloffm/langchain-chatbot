export type Message = {
    role: "user" | "bot";
    content: string;
};

export type ChatSummary = {
  thread_id: string;
};