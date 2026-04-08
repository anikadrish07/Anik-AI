/**
 * @fileOverview Service layer for authentication business logic.
 * Handles password hashing, user lookup, and session creation.
 */

import bcrypt from "bcryptjs";
import sql from "@/lib/db";
import { User, NewUser } from "@/models/user.model";
import { LoginRequest, SignupRequest } from "@/types/auth.dto";
import { login as createSession } from "@/lib/auth";

export class AuthService {
  /**
   * Validates user credentials and initiates a session.
   */
  static async login(data: LoginRequest) {
    // Fallback for prototyping if DB is not configured
    if (!process.env.DATABASE_URL) {
      if (data.email === "demo@mindflow.ai" && data.password === "password123") {
        const demoUser = { id: 0, email: "demo@mindflow.ai", name: "Demo User" };
        await createSession(demoUser);
        return { success: true, user: demoUser };
      }
      throw new Error("Database not configured. Use demo@mindflow.ai / password123");
    }

    const [user] = await sql<User[]>`
      SELECT * FROM users WHERE email = ${data.email}
    `;

    if (!user || !user.password) {
      throw new Error("Invalid email or password");
    }

    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) {
      throw new Error("Invalid email or password");
    }

    const sessionUser = { id: user.id, email: user.email, name: user.name || "" };
    await createSession(sessionUser);

    return { success: true, user: sessionUser };
  }

  /**
   * Registers a new user in the database.
   */
  static async signup(data: SignupRequest) {
    if (!process.env.DATABASE_URL) {
      throw new Error("Database connection required for signup.");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    try {
      const [user] = await sql<User[]>`
        INSERT INTO users (email, password, name)
        VALUES (${data.email}, ${hashedPassword}, ${data.name})
        RETURNING id, email, name
      `;

      const sessionUser = { id: user.id, email: user.email, name: user.name || "" };
      await createSession(sessionUser);

      return { success: true, user: sessionUser };
    } catch (error: any) {
      if (error.code === '23505') {
        throw new Error("User already exists with this email");
      }
      throw error;
    }
  }
}
