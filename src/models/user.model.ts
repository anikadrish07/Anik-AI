/**
 * @fileOverview Defines the User model representing the database structure.
 */

export interface User {
  id: number;
  email: string;
  password?: string; // Optional because we don't always want to return it
  name: string | null;
  created_at: Date;
}

export type NewUser = Omit<User, 'id' | 'created_at'>;
