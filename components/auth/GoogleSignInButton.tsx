"use client";

/**
 * TEMPORARY PLACEHOLDER. Replaced by Mark's PR (S2 Google sign-in).
 * Exists from day one so Chad's pages compile without waiting on Mark.
 */
interface GoogleSignInButtonProps {
  redirectTo?: string;
  onError?: (message: string) => void;
}

function GoogleSignInButton(_props: GoogleSignInButtonProps) {
  return null;
}

export default GoogleSignInButton;