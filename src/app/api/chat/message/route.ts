import { NextResponse } from "next/server";
import { ChatService } from "@/services/chat.service";
import { getSession } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        const session = await getSession();

        if (!session?.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { chatId, role, content } = await req.json();

        if (!chatId || !role || !content) {
            return NextResponse.json(
                { error: "Missing fields" },
                { status: 400 }
            );
        }

        if (!["user", "model"].includes(role)) {
            return NextResponse.json(
                { error: "Invalid role" },
                { status: 400 }
            );
        }

        const message = await ChatService.saveMessage(chatId, role, content);

        return NextResponse.json(message);
    } catch (error) {
        console.error("Save Message Error:", error);

        return NextResponse.json(
            { error: "Failed to save message" },
            { status: 500 }
        );
    }
}