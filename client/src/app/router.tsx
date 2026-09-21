import { createBrowserRouter, Navigate } from "react-router-dom";
import { PublicLayout, AuthenticatedLayout } from "./layouts";

// Auth feature
import { LoginPage } from "../features/auth/pages/LoginPage";

// Feature page placeholders
import { DashboardPage } from "../features/dashboard/pages/DashboardPage";
import { LeadsPage } from "../features/leads/pages/LeadsPage";
import { CampaignsPage } from "../features/campaigns/pages/CampaignsPage";
import { CampaignDetailPage } from "../features/campaigns/pages/CampaignDetailPage";
import { ClassificationPage } from "../features/classification/pages/ClassificationPage";

export const router = createBrowserRouter([
  // Public routes (unauthenticated)
  {
    element: <PublicLayout />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <Navigate to="/login" replace />,
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
        path: "/campaigns/:id",
        element: <CampaignDetailPage />,
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
