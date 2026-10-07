"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Button from "@/components/ui/Button";
import useAuth from "@/hooks/useAuth";
import { signOutUser } from "@/lib/auth";

interface SignOutButtonProps {
  redirectTo?: string;
}

function SignOutButton({ redirectTo = "/" }: SignOutButtonProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [isConfirming, setIsConfirming] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleSignOut() {
    setIsSigningOut(true);
    try {
      await signOutUser();
      router.replace(redirectTo);
    } catch (error) {
      console.error("[auth] sign out failed", error);
      setIsSigningOut(false);
      setIsConfirming(false);
    }
  }

  function handleClick() {
    if (user?.isGuest && !isConfirming) {
      setIsConfirming(true);
      return;
    }
    void handleSignOut();
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <Button variant={isConfirming ? "primary" : "secondary"} onClick={handleClick} isLoading={isSigningOut} loadingLabel="Signing you out">
        {isConfirming ? "Yes, end guest session" : "Sign out"}
      </Button>
      {isConfirming && (
        <p role="alert" aria-live="assertive" className="max-w-prose text-sm text-muted">
          Signing out ends this guest session for good. Anything from it will be gone.
        </p>
      )}
      {isConfirming && (
        <Button variant="ghost" onClick={() => setIsConfirming(false)}>
          Stay signed in
        </Button>
      )}
    </div>
  );
}

export default SignOutButton;