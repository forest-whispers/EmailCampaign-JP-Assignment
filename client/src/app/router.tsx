import { createBrowserRouter, Navigate } from "react-router-dom";
import { PublicLayout, AuthenticatedLayout } from "./layouts";

// Auth feature
import { LoginPage } from "../features/auth/pages/LoginPage";
import { RegisterPage } from "../features/auth/pages/RegisterPage";

// Features
import { ReportsPage } from "../features/reports/pages/ReportsPage";
import { LeadsPage } from "../features/leads/pages/LeadsPage";
import { CampaignsPage } from "../features/campaigns/pages/CampaignsPage";
import { CampaignDetailPage } from "../features/campaigns/pages/CampaignDetailPage";
import { ClassificationPage } from "../features/classification/pages/ClassificationPage";
import { SettingsPage } from "../features/settings/pages/SettingsPage";

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
        element: <ReportsPage />,
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
      {
        path: "/settings",
        element: <SettingsPage />,
      },
    ],
  },

  // Catch-all
  {
    path: "*",
    element: <Navigate to="/dashboard" replace />,
  },
]);
