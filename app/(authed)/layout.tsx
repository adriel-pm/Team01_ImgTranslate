"use client";

import type { ReactNode } from "react";

import AuthGuard from "@/components/auth/AuthGuard";
import AppShell from "@/components/layout/AppShell";

interface AuthedLayoutProps {
  children: ReactNode;
}

function AuthedLayout({ children }: AuthedLayoutProps) {
  return (
    <AuthGuard>
      <AppShell>{children}</AppShell>
    </AuthGuard>
  );
}

export default AuthedLayout;
