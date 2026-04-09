import sql from "@/lib/db";

export const createChat = async (userId: number, title: string) => {
  const [chat] = await sql`
    INSERT INTO chat_sessions (user_id, title)
    VALUES (${userId}, ${title})
    RETURNING *
  `;
  return chat;
};

export const saveMessage = async (
  chatId: number,
  role: string,
  content: string
) => {
  const [msg] = await sql`
    INSERT INTO chat_messages (chat_id, role, content)
    VALUES (${chatId}, ${role}, ${content})
    RETURNING *
  `;
  return msg;
};

export const getChatMessages = async (chatId: number) => {
  const messages = await sql`
    SELECT role, content
    FROM chat_messages
    WHERE chat_id = ${chatId}
    ORDER BY created_at ASC
  `;
  return messages;
};

export const getUserChats = async (userId: number) => {
  const chats = await sql`
    SELECT id, title, created_at
    FROM chat_sessions
    WHERE user_id = ${userId}
    ORDER BY created_at DESC
  `;
  return chats;
};