"use client";

/**
 * TEMPORARY PLACEHOLDER.
 * Replaced entirely by Andy's PR (S1-10/S1-12), which adds the real guest
 * sign-in button here. This stub exists only so the landing page can
 * compile until that PR lands.
 */
interface GuestButtonProps {
  redirectTo?: string;
  onError?: (message: string) => void;
}

function GuestButton(_props: GuestButtonProps) {
  return null;
}

export default GuestButton;