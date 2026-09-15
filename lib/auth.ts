/**
 * TEMPORARY PLACEHOLDER.
 * This file will be fully replaced by Chad's PR (signup/login), which adds
 * the real signUpWithEmail, signInWithEmail, and error-handling functions
 * here. This stub exists only so the rest of the app (AuthProvider) can
 * compile and pass CI until that PR lands.
 */
import type { User } from "firebase/auth";
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