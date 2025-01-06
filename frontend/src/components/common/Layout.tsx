import { Navigate, Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import useAuth from "./AuthProvider";

const Layout = () => {
  const { isAuthenticated, isLoading } = useAuth();
  if (!isAuthenticated && !isLoading) return <Navigate to="/login" />;
  return (
    <>
      <Navbar />
      <main className="container mt-4">
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
