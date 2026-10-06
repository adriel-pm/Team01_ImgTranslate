"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Button from "@/components/ui/Button";
import { signInWithGoogle } from "@/lib/authGoogle";

interface GoogleSignInButtonProps {
  redirectTo?: string;
  onError?: (message: string) => void;
}

function GoogleSignInButton({ redirectTo = "/home", onError }: GoogleSignInButtonProps) {
  const router = useRouter();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  async function handleClick() {
    setIsSigningIn(true);
    setLocalError(null);
    try {
      await signInWithGoogle();
      router.replace(redirectTo);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Google sign-in failed. Try again.";
      if (onError) onError(message);
      else setLocalError(message);
      setIsSigningIn(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Button variant="secondary" fullWidth onClick={handleClick} isLoading={isSigningIn} loadingLabel="Opening Google sign-in">
        <GoogleMark />
        Continue with Google
      </Button>
      {localError && <p role="alert" className="text-sm text-danger">{localError}</p>}
    </div>
  );
}

function GoogleMark() {
  return (
    <svg className="h-[18px] w-[18px]" viewBox="0 0 18 18" aria-hidden="true" focusable="false">
      <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62Z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.02-3.7H.96v2.34A9 9 0 0 0 9 18Z" />
      <path fill="#FBBC05" d="M3.98 10.72a5.4 5.4 0 0 1 0-3.44V4.94H.96a9 9 0 0 0 0 8.12l3.02-2.34Z" />
      <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.46 3.44 1.35l2.58-2.58C13.46.9 11.43 0 9 0A9 9 0 0 0 .96 4.94l3.02 2.34C4.68 5.16 6.66 3.58 9 3.58Z" />
    </svg>
  );
}

export default GoogleSignInButton;