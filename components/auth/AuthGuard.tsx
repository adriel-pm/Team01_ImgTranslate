"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";

import useAuth from "@/hooks/useAuth";

interface AuthGuardProps {
  children: ReactNode;
  redirectTo?: string;
}

function AuthGuard({ children, redirectTo = "/login" }: AuthGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace(redirectTo);
    }
  }, [loading, user, router, redirectTo]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center" role="status" aria-live="polite">
        <p className="text-sm text-muted">Checking your session…</p>
      </div>
    );
  }

  if (!user) return null;

  return <>{children}</>;
}

export default AuthGuard;