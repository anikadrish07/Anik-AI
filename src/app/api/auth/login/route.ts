/**
 * @fileOverview API Route for user login.
 * Acts as the controller, delegating logic to the AuthService.
 */

import { NextResponse } from "next/server";
import { AuthService } from "@/services/auth.service";
import { LoginRequestSchema } from "@/types/auth.dto";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate request DTO
    const validation = LoginRequestSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: "Invalid input data" }, { status: 400 });
    }

    const result = await AuthService.login(validation.data);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Login API Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: error.message.includes("Invalid") ? 401 : 500 }
    );
  }
}
