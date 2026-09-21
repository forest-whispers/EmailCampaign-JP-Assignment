import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getMeApi, loginApi, logoutApi } from "./auth.api";
import type { AuthUser, LoginInput } from "./auth.types";

export const AUTH_QUERY_KEY = ["auth", "me"] as const;

/**
 * Query for the currently authenticated user.
 * AuthenticatedLayout owns this query.
 */
export function useCurrentUserQuery() {
  return useQuery<AuthUser>({
    queryKey: AUTH_QUERY_KEY,
    queryFn: async () => {
      const response = await getMeApi();
      return response.user;
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Login mutation.
 * Sets the query cache directly with the returned user and navigates to /dashboard.
 */
export function useLoginMutation() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (credentials: LoginInput) => loginApi(credentials),
    onSuccess: (response) => {
      // Set query cache directly with the authenticated user
      queryClient.setQueryData(AUTH_QUERY_KEY, response.user);
      navigate("/dashboard", { replace: true });
    },
  });
}

/**
 * Logout mutation.
 * On success, clears the auth query cache and navigates to /login.
 */
export function useLogoutMutation() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: () => logoutApi(),
    onSuccess: () => {
      // Clear cache only after the backend confirms cookie clearance
      queryClient.removeQueries({ queryKey: AUTH_QUERY_KEY });
      navigate("/login", { replace: true });
    },
  });
}
