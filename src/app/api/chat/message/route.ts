import { NextResponse } from "next/server";
import { saveMessage } from "@/services/chat.service";

export async function POST(req: Request) {
  const { chatId, role, content } = await req.json();

  const message = await saveMessage(chatId, role, content);

  return NextResponse.json(message);
}