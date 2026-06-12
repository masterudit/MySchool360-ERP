import type { AuthenticatedUser, LoginCredentials } from "../types/auth.types";
import { findMockUser } from "../mocks/users";

const SIMULATED_LATENCY_MS = 400;

export async function login(
  credentials: LoginCredentials,
): Promise<AuthenticatedUser> {
  await new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));
  const user = findMockUser(credentials.email, credentials.password);
  if (!user) {
    throw new Error("Invalid email or password");
  }
  return user;
}

export async function logout(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 100));
}
