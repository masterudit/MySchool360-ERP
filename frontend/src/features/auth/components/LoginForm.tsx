import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useState } from "react";
import Checkbox from "../../../components/form/input/Checkbox";
import Label from "../../../components/form/Label";
import { EyeCloseIcon, EyeIcon } from "../../../icons";
import { useLogin } from "../hooks/useLogin";
import { MOCK_CREDENTIALS_HINT } from "../mocks/users";
import { loginSchema, type LoginFormValues } from "../schemas/login.schema";

const inputClassName =
  "h-11 w-full rounded-lg border bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const loginMutation = useLogin();
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", rememberMe: false },
  });

  const fieldStateClass = (hasError: boolean) =>
    hasError
      ? "border-error-500 focus:ring-error-500/20"
      : "border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700";

  return (
    <div className="w-full max-w-md py-10">
      <div className="mb-8">
        <p className="mb-3 text-sm font-semibold text-brand-500">Welcome back</p>
        <h2 className="mb-2 text-title-sm font-semibold text-gray-800 dark:text-white/90 sm:text-title-md">
          Sign in to your school
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Use the account provided by your school administrator.
        </p>
      </div>

      <form onSubmit={handleSubmit((values) => loginMutation.mutate(values))} noValidate>
        <div className="space-y-6">
          <div>
            <Label htmlFor="email">Email address <span className="text-error-500">*</span></Label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              placeholder="name@school.edu"
              className={`${inputClassName} ${fieldStateClass(Boolean(errors.email))}`}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "email-error" : undefined}
              {...register("email")}
            />
            {errors.email && <p id="email-error" className="mt-1.5 text-xs text-error-500">{errors.email.message}</p>}
          </div>

          <div>
            <Label htmlFor="password">Password <span className="text-error-500">*</span></Label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password"
                className={`${inputClassName} pr-12 ${fieldStateClass(Boolean(errors.password))}`}
                aria-invalid={Boolean(errors.password)}
                aria-describedby={errors.password ? "password-error" : undefined}
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeIcon className="size-5 fill-current" /> : <EyeCloseIcon className="size-5 fill-current" />}
              </button>
            </div>
            {errors.password && <p id="password-error" className="mt-1.5 text-xs text-error-500">{errors.password.message}</p>}
          </div>

          <div className="flex items-center justify-between gap-4">
            <Controller
              name="rememberMe"
              control={control}
              render={({ field }) => (
                <Checkbox id="remember-me" checked={field.value} onChange={field.onChange} label="Keep me signed in" />
              )}
            />
            <a href="/forgot-password" className="text-sm text-brand-500 hover:text-brand-600">
              Forgot password?
            </a>
          </div>

          {loginMutation.isError && (
            <div role="alert" className="rounded-lg border border-error-200 bg-error-50 px-4 py-3 text-sm text-error-700">
              {loginMutation.error instanceof Error
                ? loginMutation.error.message
                : "Unable to sign in. Check your details and try again."}
            </div>
          )}

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="inline-flex w-full items-center justify-center rounded-lg bg-brand-500 px-4 py-3 text-sm font-medium text-white shadow-theme-xs transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:bg-brand-300"
          >
            {loginMutation.isPending ? "Signing in..." : "Sign in"}
          </button>
        </div>
      </form>

      <div className="mt-8 rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4 text-xs text-gray-600 dark:border-gray-700 dark:bg-gray-900/40 dark:text-gray-400">
        <p className="mb-1 font-semibold text-gray-700 dark:text-gray-300">
          Demo credentials (Principal)
        </p>
        <p>
          Email: <span className="font-mono">{MOCK_CREDENTIALS_HINT.email}</span>
        </p>
        <p>
          Password: <span className="font-mono">{MOCK_CREDENTIALS_HINT.password}</span>
        </p>
      </div>

      <p className="mt-6 text-center text-xs leading-5 text-gray-500 dark:text-gray-400">
        Having trouble signing in? Contact your school administrator.
      </p>
    </div>
  );
}
