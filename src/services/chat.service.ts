import sql from "@/lib/db";

export class ChatService {

  // Create Chat
  static async createChat(userId: number, title: string) {
    try {
      const [chat] = await sql`
        INSERT INTO chat_sessions (user_id, title)
        VALUES (${userId}, ${title})
        RETURNING *
      `;
      return chat;
    } catch (error) {
      console.error("Create Chat Error:", error);
      throw new Error("Failed to create chat");
    }
  }

  // Save Message
  static async saveMessage(chatId: number, role: string, content: string) {
    try {
      const [msg] = await sql`
        INSERT INTO chat_messages (chat_id, role, content)
        VALUES (${chatId}, ${role}, ${content})
        RETURNING *
      `;
      return msg;
    } catch (error) {
      console.error("Save Message Error:", error);
      throw new Error("Failed to save message");
    }
  }

  //Get Messages
  static async getMessages(chatId: number) {
    try {
      return await sql`
        SELECT role, content
        FROM chat_messages
        WHERE chat_id = ${chatId}
        ORDER BY created_at ASC
      `;
    } catch (error) {
      console.error("Get Messages Error:", error);
      throw new Error("Failed to fetch messages");
    }
  }

  //Get User Chats
  static async getUserChats(userId: number) {
    try {
      return await sql`
        SELECT id, title, created_at
        FROM chat_sessions
        WHERE user_id = ${userId}
        ORDER BY created_at DESC
      `;
    } catch (error) {
      console.error("Get Chats Error:", error);
      throw new Error("Failed to fetch chats");
    }
  }
}