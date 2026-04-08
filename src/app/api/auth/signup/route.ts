/**
 * @fileOverview API Route for user registration.
 */

import { NextResponse } from "next/server";
import { AuthService } from "@/services/auth.service";
import { SignupRequestSchema } from "@/types/auth.dto";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate request DTO
    const validation = SignupRequestSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.format() }, { status: 400 });
    }

    const result = await AuthService.signup(validation.data);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Signup API Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: error.message.includes("exists") ? 400 : 500 }
    );
  }
}
