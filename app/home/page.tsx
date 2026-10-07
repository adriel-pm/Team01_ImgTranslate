"use client";

import AuthGuard from "@/components/auth/AuthGuard";
import SignOutButton from "@/components/auth/SignOutButton";
import useAuth from "@/hooks/useAuth";

function HomePage() {
  return (
    <AuthGuard>
      <HomeContent />
    </AuthGuard>
  );
}

function HomeContent() {
  const { user } = useAuth();
  if (!user) return null;

  const greetingName = user.displayName ?? user.email ?? "there";

  return (
    <main id="main" className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-2xl font-semibold tracking-tight text-ink">Welcome, {greetingName}</h1>
      {user.isGuest ? (
        <p className="mt-2 max-w-prose text-[15px] text-muted">
          You&apos;re using a guest session. It works everywhere in the app, but nothing is saved once you sign out.
        </p>
      ) : (
        <p className="mt-2 max-w-prose text-[15px] text-muted">
          Your account is set up. The camera and translation screens land in the next sprints.
        </p>
      )}
      <div className="mt-10">
        <SignOutButton />
      </div>
    </main>
  );
}

export default HomePage;