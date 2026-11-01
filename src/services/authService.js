import { http, USE_MOCK, delay, tokenStore } from "./http";

const USERS_KEY = "hirenest_users";
const SESSION_KEY = "hirenest_session";

const read = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
};
const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));
const stripPassword = ({ password, ...user }) => user;

/*
 * BACKEND CONTRACT (what your API should return)
 *   POST /auth/register  -> { user, token }
 *   POST /auth/login     -> { user, token }
 *   GET  /auth/me        -> { user }
 *   PUT  /users/me       -> { user }
 * The mock below stores plain-text passwords in localStorage ONLY because it is a demo.
 * Your real backend must hash passwords (bcrypt/argon2).
 */

export const authService = {
  getSession() {
    return USE_MOCK || tokenStore.get() ? read(SESSION_KEY, null) : null;
  },

  async validateSession() {
    if (USE_MOCK) return this.getSession();
    if (!tokenStore.get()) {
      this.clearSession();
      return null;
    }
    try {
      const { user } = await http("/auth/me");
      write(SESSION_KEY, user);
      return user;
    } catch (error) {
      if (error.status === 401) {
        this.clearSession();
        return null;
      }
      throw error;
    }
  },

  async register(form) {
    if (!USE_MOCK) {
      const { user, token } = await http("/auth/register", { method: "POST", body: form });
      tokenStore.set(token);
      write(SESSION_KEY, user);
      return user;
    }
    await delay();
    const users = read(USERS_KEY, []);
    if (users.some((u) => u.email.toLowerCase() === form.email.toLowerCase()))
      throw new Error("An account with this email already exists. Try logging in.");
    const user = {
      id: crypto.randomUUID(),
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      phone: form.phone,
      role: form.role,
      password: form.password,
      location: "",
      headline: "",
      skills: [],
      about: "",
      createdAt: new Date().toISOString(),
    };
    write(USERS_KEY, [...users, user]);
    write(SESSION_KEY, stripPassword(user));
    return stripPassword(user);
  },

  async login(email, password) {
    if (!USE_MOCK) {
      const { user, token } = await http("/auth/login", { method: "POST", body: { email, password } });
      tokenStore.set(token);
      write(SESSION_KEY, user);
      return user;
    }
    await delay();
    const user = read(USERS_KEY, []).find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!user) throw new Error("Email or password is incorrect.");
    write(SESSION_KEY, stripPassword(user));
    return stripPassword(user);
  },

  logout() {
    this.clearSession();
  },

  clearSession() {
    localStorage.removeItem(SESSION_KEY);
    tokenStore.clear();
  },

  async updateProfile(userId, changes) {
    if (!USE_MOCK) {
      const { user } = await http("/users/me", { method: "PUT", body: changes });
      write(SESSION_KEY, user);
      return user;
    }
    await delay(250);
    const users = read(USERS_KEY, []);
    const updated = users.map((u) => (u.id === userId ? { ...u, ...changes } : u));
    write(USERS_KEY, updated);
    const user = stripPassword(updated.find((u) => u.id === userId));
    write(SESSION_KEY, user);
    return user;
  },
};
