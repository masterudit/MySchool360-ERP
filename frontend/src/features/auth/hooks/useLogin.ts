import { useMutation } from "@tanstack/react-query";
import { useNavigate, useLocation } from "react-router";
import { login } from "../api/auth.api";
import { useAuth } from "../context/useAuth";
import type { LoginCredentials } from "../types/auth.types";

type LocationState = { from?: string } | null;

export function useLogin() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => login(credentials),
    onSuccess: (user, variables) => {
      signIn(user, { persistent: variables.rememberMe });
      const fromPath = (location.state as LocationState)?.from;
      navigate(fromPath ?? "/dashboard", { replace: true });
    },
  });
}
