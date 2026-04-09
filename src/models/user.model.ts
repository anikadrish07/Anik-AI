export interface User {
  id: number;
  email: string;
  password?: string; 
  name: string | null;
  created_at: Date;
}

export type NewUser = Omit<User, 'id' | 'created_at'>;
