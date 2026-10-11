"use client";

import LinkButton from "@/components/ui/LinkButton";
import useAuth from "@/hooks/useAuth";

function HistoryPage() {
  const { user } = useAuth();

  return (
    <main id="main" className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-2xl font-semibold tracking-tight text-ink">History</h1>

      {user?.isGuest ? (
        <p className="mt-2 max-w-prose text-[15px] text-muted">
          Guest sessions don&apos;t save history. Create an account to keep your translations
          across visits.
        </p>
      ) : (
        <p className="mt-2 max-w-prose text-[15px] text-muted">No translations yet.</p>
      )}

      <div className="mt-6 max-w-xs">
        <LinkButton href="/home">Start translating</LinkButton>
      </div>
    </main>
  );
}

export default HistoryPage;