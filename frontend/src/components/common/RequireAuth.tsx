import { Navigate } from "react-router-dom";
import useAuth from "./AuthProvider";
import { Loader } from "lucide-react";

interface RequireAuthProps {
  children: React.ReactNode;
}

const RequireAuth = ({ children }: RequireAuthProps) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="h-screen grid place-content-center">
        <Loader className="size-12 animate-spin" />
      </div>
    );
  }

  if (!isLoading && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default RequireAuth;
