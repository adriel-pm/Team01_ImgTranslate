"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Button from "@/components/ui/Button";
import { signInAsGuest } from "@/lib/authGuest";

interface GuestButtonProps {
  redirectTo?: string;
  onError?: (message: string) => void;
}

function GuestButton({ redirectTo = "/home", onError }: GuestButtonProps) {
  const router = useRouter();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  async function handleClick() {
    setIsSigningIn(true);
    setLocalError(null);
    try {
      await signInAsGuest();
      router.replace(redirectTo);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Couldn't start a guest session.";
      if (onError) onError(message);
      else setLocalError(message);
      setIsSigningIn(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Button variant="ghost" fullWidth onClick={handleClick} isLoading={isSigningIn} loadingLabel="Starting guest session">
        Continue as guest
      </Button>
      {localError && <p role="alert" className="text-sm text-danger">{localError}</p>}
    </div>
  );
}

export default GuestButton;