/**
 * @fileOverview Data Transfer Objects (DTOs) for authentication requests.
 * Uses Zod for runtime validation.
 */

import { z } from "zod";

export const LoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type LoginRequest = z.infer<typeof LoginRequestSchema>;

export const SignupRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
});

export type SignupRequest = z.infer<typeof SignupRequestSchema>;

export interface AuthResponse {
  success: boolean;
  error?: string;
  user?: {
    id: number;
    email: string;
    name: string | null;
  };
}
