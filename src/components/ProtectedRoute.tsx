"use client";

import { useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";

export type RequiredRole = "admin" | "buyer" | "any";

type ProtectedRouteProps = {
  children: ReactNode;
  requireRole?: RequiredRole;
  redirectTo?: string;
};

/**
 * ProtectedRoute - Wraps components that require authentication or specific roles
 *
 * @param requireRole - "any" = authenticated users, "admin" = admins only, "buyer" = buyers only
 * @param redirectTo - Where to redirect if access is denied (default: "/login")
 */
export function ProtectedRoute({
  children,
  requireRole = "any",
  redirectTo,
}: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, loading, isAdmin, isBuyer } = useAuth();

  useEffect(() => {
    if (loading) return;

    let shouldRedirect = false;
    let destination = redirectTo || "/login";

    if (!isAuthenticated) {
      shouldRedirect = true;
      // For unauthenticated, use default redirectTo or login
    } else if (requireRole === "admin" && !isAdmin) {
      shouldRedirect = true;
      destination = "/buy";
    } else if (requireRole === "buyer" && !isBuyer) {
      shouldRedirect = true;
      destination = "/admin";
    }

    if (shouldRedirect) {
      router.replace(destination);
    }
  }, [loading, isAuthenticated, isAdmin, isBuyer, requireRole, redirectTo, router]);

  // Show loading while auth state is being determined
  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" />
      </div>
    );
  }

  // Don't render children if user shouldn't have access
  if (!isAuthenticated) return null;
  if (requireRole === "admin" && !isAdmin) return null;
  if (requireRole === "buyer" && !isBuyer) return null;

  return <>{children}</>;
}
