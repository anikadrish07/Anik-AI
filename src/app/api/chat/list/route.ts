import { ChatService } from "@/services/chat.service";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const chats = await ChatService.getUserChats(session.user.id);

    return Response.json(chats);
  } catch (error) {
    return Response.json(
      { error: "Failed to fetch chats" },
      { status: 500 }
    );
  }
}