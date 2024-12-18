import { createBrowserRouter } from "react-router-dom";
import LoginPage from "@/components/pages/LoginPage";
import SignupPage from "@/components/pages/SignupPage";
import HomePage from "@/components/pages/HomePage";
import Layout from "@/components/common/Layout";

export const routes = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: "/create",
        element: <div>create new task</div>,
      },
    ],
  },
]);
