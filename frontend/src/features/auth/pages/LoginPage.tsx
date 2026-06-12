import { Navigate } from "react-router";
import PageMeta from "../../../components/common/PageMeta";
import { AuthLayout } from "../components/AuthLayout";
import { LoginForm } from "../components/LoginForm";
import { useAuth } from "../context/useAuth";

export function LoginPage() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <>
      <PageMeta title="Sign in | MySchool ERP" description="Securely sign in to MySchool ERP." />
      <AuthLayout>
        <LoginForm />
      </AuthLayout>
    </>
  );
}
