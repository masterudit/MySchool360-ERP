import type { AuthenticatedUser } from "../types/auth.types";

const STORAGE_KEY = "myschool.auth.user";

function pickStorage(persistent: boolean): Storage {
  return persistent ? window.localStorage : window.sessionStorage;
}

export function readStoredUser(): AuthenticatedUser | null {
  for (const storage of [window.localStorage, window.sessionStorage]) {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) continue;
    try {
      return JSON.parse(raw) as AuthenticatedUser;
    } catch {
      storage.removeItem(STORAGE_KEY);
    }
  }
  return null;
}

export function writeStoredUser(
  user: AuthenticatedUser,
  persistent: boolean,
): void {
  const primary = pickStorage(persistent);
  const secondary = pickStorage(!persistent);
  primary.setItem(STORAGE_KEY, JSON.stringify(user));
  secondary.removeItem(STORAGE_KEY);
}

export function clearStoredUser(): void {
  window.localStorage.removeItem(STORAGE_KEY);
  window.sessionStorage.removeItem(STORAGE_KEY);
}
