import { User, userRole } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import {
  getCurrentUserProfile,
  getCurrentUserRole,
} from "@/app/(actions)/user/user-actions";

export function useCurrentUser() {
  const {
    data: userData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["user"],
    queryFn: getCurrentUserProfile,
    enabled: true,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return { user: userData?.user, isLoading, isError, error };
}

export function useCurrentUserRole() {
  const {
    data: role,
    isLoading,
    isError,
    error,
  } = useQuery<userRole | null>({
    queryKey: ["userRole"],
    queryFn: getCurrentUserRole,
    enabled: true,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return { role, isLoading, isError, error };
}
