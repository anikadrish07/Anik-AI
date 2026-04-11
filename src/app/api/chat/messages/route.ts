import { NextResponse } from "next/server";
import { ChatService } from "@/services/chat.service";
import { getSession } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const session = await getSession();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const chatId = Number(searchParams.get("chatId"));

    if (!chatId) {
      return NextResponse.json(
        { error: "chatId required" },
        { status: 400 }
      );
    }

    const messages = await ChatService.getMessages(chatId);

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Fetch Messages Error:", error);

    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}