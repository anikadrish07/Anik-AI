import bcrypt from "bcryptjs";
import sql from "@/lib/db";
import { User } from "@/models/user.model";
import { LoginRequest, SignupRequest } from "@/types/auth.dto";
import { login as createSession } from "@/lib/auth";

export class AuthService {
  /**
   * Validates user credentials and initiates a session.
   */
  static async login(data: LoginRequest) {
    // Fallback for prototyping if DB is not configured or connection failed
    if (!sql) {
      if (data.email === "demo@mindflux.ai" && data.password === "password123") {
        const demoUser = { id: 0, email: "demo@mindflux.ai", name: "Demo User" };
        await createSession(demoUser);
        return { success: true, user: demoUser };
      }
      throw new Error("Database not configured. Please set DATABASE_URL or use demo@mindflux.ai / password123");
    }

    try {
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
    } catch (error: any) {
      console.error("Database Login Error:", error);
      // If network/TLS error occurs, provide a helpful message
      if (error.message.includes("secure TLS connection")) {
        throw new Error("Database connection failed (TLS Error). Check your DATABASE_URL and SSL settings.");
      }
      throw error;
    }
  }

  /**
   * Registers a new user in the database.
   */
  static async signup(data: SignupRequest) {
    if (!sql) {
      throw new Error("Database connection required for signup. Please configure DATABASE_URL.");
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
