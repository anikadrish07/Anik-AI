export interface ChatSession {
  id: number;
  user_id: number;
  title: string;
  created_at: Date;
}

export interface ChatMessage {
  id: number;
  chat_id: number;
  role: "user" | "model";
  content: string;
  created_at: Date;
}