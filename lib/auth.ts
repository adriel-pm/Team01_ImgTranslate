/**
 * Shared authentication utilities used by every sign-in method.
 *
 * This file is foundation-owned and stable for the rest of the sprint.
 * Each sign-in method lives in its own file that imports from here:
 * lib/authEmail.ts, lib/authGoogle.ts, lib/authGuest.ts. Nobody edits this
 * file directly this sprint -- that's what makes parallel work possible.
 */
import { signOut, type User } from "firebase/auth";

import { auth } from "@/lib/firebase";

import type { AppUser } from "@/lib/types";

export function toAppUser(user: User | null): AppUser | null {
  if (!user) return null;

  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    isGuest: user.isAnonymous,
  };
}

export function getAuthErrorMessage(error: unknown): string {
  const code =
    typeof error === "object" && error !== null && "code" in error
      ? String((error as { code: unknown }).code)
      : "";

  switch (code) {
    case "auth/invalid-email":
      return "That email address isn't formatted correctly.";
    case "auth/missing-password":
      return "Enter your password.";
    case "auth/weak-password":
      return "Passwords need at least 6 characters.";
    case "auth/email-already-in-use":
      return "An account already exists with that email. Log in instead.";
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "That email and password don't match an account.";
    case "auth/too-many-requests":
      return "Too many attempts. Wait a few minutes, then try again.";
    case "auth/network-request-failed":
      return "Can't reach the network. Check your connection and try again.";
    case "auth/popup-closed-by-user":
    case "auth/cancelled-popup-request":
      return "Google sign-in was closed before it finished.";
    case "auth/popup-blocked":
      return "Your browser blocked the Google sign-in window. Allow pop-ups for this site and try again.";
    case "auth/operation-not-allowed":
      return "That sign-in method isn't enabled in Firebase yet. Enable it under Authentication > Sign-in method.";
    case "auth/admin-restricted-operation":
      return "Guest sign-in isn't enabled in Firebase yet. Enable Anonymous under Authentication > Sign-in method.";
    default:
      return "Something went wrong signing you in. Try again.";
  }
}

/** Wrap any Firebase Auth call so callers always get a UI-safe error message. */
export async function runAuthOperation<T>(operation: () => Promise<T>): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    console.error("[auth]", error);
    throw new Error(getAuthErrorMessage(error));
  }
}

/**
 * Sign the current user out. Lives here, not in a per-method file, because
 * every sign-in method shares the same sign-out call.
 */
export async function signOutUser(): Promise<void> {
  return runAuthOperation(async () => {
    await signOut(auth);
  });
}