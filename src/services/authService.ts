import type { Credentials, User } from "../types/auth";
import { API_BASE_URL } from "../config";

export const authService = {
  async login(credentials: Credentials): Promise<{ token: string; user: User }> {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    if (!res.ok) {
      try {
        const data = await res.json();
        if (res.status === 401) {
          throw new Error("AUTH_INVALID");
        }
        throw new Error("AUTH_GENERIC");
      } catch {
        if (res.status === 401) {
          throw new Error("AUTH_INVALID");
        }
        throw new Error("AUTH_GENERIC");
      }
    }
    const data = (await res.json()) as { accessToken: string; user: { id: string; name: string; email: string } };
    return {
      token: data.accessToken,
      user: { ...data.user, role: "admin" },
    };
  },

  async register(input: { name: string; email: string; password: string }) {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!res.ok) {
      try {
        const data = await res.json();
        if (res.status === 409 || /exists|registered/i.test(String(data?.message))) {
          throw new Error("AUTH_EMAIL_EXISTS");
        }
        throw new Error("AUTH_GENERIC");
      } catch {
        if (res.status === 409) {
          throw new Error("AUTH_EMAIL_EXISTS");
        }
        throw new Error("AUTH_GENERIC");
      }
    }
    return res.json();
  },
};


