import {
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { AuthenticatedUser, Role } from "../types/auth.types";
import {
  clearStoredUser,
  readStoredUser,
  writeStoredUser,
} from "../storage/authStorage";
import { AuthContext, type AuthContextValue } from "./authContext";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthenticatedUser | null>(() => readStoredUser());

  const signIn = useCallback<AuthContextValue["signIn"]>(
    (nextUser, { persistent }) => {
      writeStoredUser(nextUser, persistent);
      setUser(nextUser);
    },
    [],
  );

  const signOut = useCallback(() => {
    clearStoredUser();
    setUser(null);
  }, []);

  const hasRole = useCallback(
    (role: Role) => Boolean(user?.roles.includes(role)),
    [user],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      signIn,
      signOut,
      hasRole,
    }),
    [user, signIn, signOut, hasRole],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
