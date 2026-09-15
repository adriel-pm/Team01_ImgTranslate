"use client";

import { useContext } from "react";

import { AuthContext, type AuthContextValue } from "@/components/providers/AuthProvider";

/**
 * Read the current auth state.
 *
 * Usage:
 *   const { user, loading } = useAuth();
 *   if (loading) return <Spinner />;
 *   if (!user) return <LoggedOutView />;
 *
 * The thrown error is deliberate. Returning a default like
 * `{ user: null, loading: false }` when the provider is missing would make a
 * forgotten <AuthProvider> look like "signed out" -- an hour of debugging.
 * Failing immediately names the actual problem.
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used inside <AuthProvider>. Check app/layout.tsx.");
  }

  return context;
}

export default useAuth;
