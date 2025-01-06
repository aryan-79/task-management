import { Navigate } from "react-router-dom";
import useAuth from "./AuthProvider";
import { Loader } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="h-screen grid place-content-center">
        <Loader className="size-12 animate-spin" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AuthLayout;
