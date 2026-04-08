
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import sql from "@/lib/db";
import { login } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Basic protection against uninitialized DB
    if (!process.env.DATABASE_URL) {
      // FOR PROTOTYPING ONLY: Allow demo login if DB is not configured
      if (email === "demo@mindflow.ai" && password === "password123") {
        await login({ id: 0, email: "demo@mindflow.ai", name: "Demo User" });
        return NextResponse.json({ success: true });
      }
      return NextResponse.json({ error: "Database not configured. Use demo@mindflow.ai / password123" }, { status: 500 });
    }

    const [user] = await sql`
      SELECT * FROM users WHERE email = ${email}
    `;

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    await login({ id: user.id, email: user.email, name: user.name });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Login Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
