export type UserRole = "admin" | "editor" | "viewer";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthState {
  isAuthenticated: boolean;
  token?: string;
  user?: User;
}

export interface Credentials {
  email: string;
  password: string;
}


