import { createContext } from "react";
import type { AuthenticatedUser, Role } from "../types/auth.types";

export type AuthContextValue = {
  user: AuthenticatedUser | null;
  isAuthenticated: boolean;
  signIn: (user: AuthenticatedUser, options: { persistent: boolean }) => void;
  signOut: () => void;
  hasRole: (role: Role) => boolean;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
