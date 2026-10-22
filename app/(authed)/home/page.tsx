"use client";

import useAuth from "@/hooks/useAuth";

function HomePage() {
  const { user } = useAuth();
  if (!user) return null; // AuthGuard in the layout already handles this; satisfies TypeScript.

  const greetingName = user.displayName ?? user.email ?? "there";

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-ink">Welcome, {greetingName}</h1>

      {user.isGuest ? (
        <p className="mt-2 max-w-prose text-[15px] text-muted">
          You&apos;re using a guest session. It works everywhere in the app, but nothing is saved
          once you sign out.
        </p>
      ) : (
        <p className="mt-2 max-w-prose text-[15px] text-muted">
          Your account is set up. The camera and translation screens land in the next sprints.
        </p>
      )}
    </div>
  );
}

export default HomePage;
