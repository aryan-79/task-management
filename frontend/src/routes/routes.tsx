import { createBrowserRouter } from "react-router-dom";
import LoginPage from "@/components/pages/LoginPage";
import SignupPage from "@/components/pages/SignupPage";
import HomePage from "@/components/pages/HomePage";
import Layout from "@/components/common/Layout";
import RequireAuth from "@/components/common/RequireAuth";
import AuthLayout from "@/components/common/AuthLayout";

export const routes = createBrowserRouter([
  {
    path: "/login",
    element: (
      <AuthLayout>
        <LoginPage />
      </AuthLayout>
    ),
  },
  {
    path: "/signup",
    element: (
      <AuthLayout>
        <SignupPage />
      </AuthLayout>
    ),
  },
  {
    path: "/",
    element: (
      <RequireAuth>
        <Layout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <HomePage /> },
      {
        path: "/create",
        element: <div>create new task</div>,
      },
    ],
  },
]);
