import { lazy } from "react";

// project import
import Loadable from "../components/Loadable";
import MinimalLayout from "..//layout/MinimalLayout";
import UnProtectedRoute from "../controllers/un-protected-route";

// render - login
const AuthLogin = Loadable(lazy(() => import("../pages/authentication/Login")));

const LoginRoutes = {
  path: "/",
  element: (
    <UnProtectedRoute>
      <MinimalLayout />
    </UnProtectedRoute>
  ),
  children: [
    {
      path: "/",
      element: <AuthLogin />,
    },
  ],
};

export default LoginRoutes;
