/**
 * Firestore user profile helpers. Called by each sign-in method after a
 * successful sign-in, so every account -- email, Google, or guest -- ends
 * up with a profile document.
 */
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

import { db } from "@/lib/firebase";

import { DEFAULT_USER_PREFERENCES, type UserPreferences } from "@/lib/types";

/**
 * Create a Firestore profile for a new user, if one doesn't already exist.
 * Safe to call on every sign-in, not just signup -- an existing profile is
 * never overwritten.
 */
export async function ensureUserProfile(uid: string): Promise<void> {
  const ref = doc(db, "users", uid);
  const existing = await getDoc(ref);

  if (!existing.exists()) {
    await setDoc(ref, {
      ...DEFAULT_USER_PREFERENCES,
      createdAt: serverTimestamp(),
    });
  }
}

export async function getUserProfile(uid: string): Promise<UserPreferences | null> {
  const ref = doc(db, "users", uid);
  const snapshot = await getDoc(ref);
  return snapshot.exists() ? (snapshot.data() as UserPreferences) : null;
}