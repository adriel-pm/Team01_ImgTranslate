import type { ReactNode } from "react";

import TopNav from "@/components/layout/TopNav";

interface AppShellProps {
  children: ReactNode;
}

function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-paper">
      <TopNav />
      <main id="main" className="mx-auto max-w-2xl px-6 py-10">
        {children}
      </main>
    </div>
  );
}

export default AppShell;