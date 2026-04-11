import { ChatService } from "@/services/chat.service";
import { getSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getSession();

    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title } = await req.json();

    const chat = await ChatService.createChat(session.user.id, title);

    return Response.json(chat);
  } catch (error) {
    return Response.json(
      { error: "Failed to create chat" },
      { status: 500 }
    );
  }
}