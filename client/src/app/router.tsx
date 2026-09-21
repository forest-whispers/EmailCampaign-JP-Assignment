import { createBrowserRouter, Navigate } from "react-router-dom";
import { PublicLayout, AuthenticatedLayout } from "./layouts";

// Feature page placeholders
import { LoginPage } from "../features/auth/pages/LoginPage";
import { RegisterPage } from "../features/auth/pages/RegisterPage";
import { DashboardPage } from "../features/dashboard/pages/DashboardPage";
import { LeadsPage } from "../features/leads/pages/LeadsPage";
import { CampaignsPage } from "../features/campaigns/pages/CampaignsPage";
import { ClassificationPage } from "../features/classification/pages/ClassificationPage";

export const router = createBrowserRouter([
  // Public routes
  {
    element: <PublicLayout />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
    ],
  },

  // Authenticated routes
  {
    element: <AuthenticatedLayout />,
    children: [
      {
        path: "/",
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: "/dashboard",
        element: <DashboardPage />,
      },
      {
        path: "/leads",
        element: <LeadsPage />,
      },
      {
        path: "/campaigns",
        element: <CampaignsPage />,
      },
      {
        path: "/classification",
        element: <ClassificationPage />,
      },
    ],
  },

  // Catch-all
  {
    path: "*",
    element: <Navigate to="/dashboard" replace />,
  },
]);
