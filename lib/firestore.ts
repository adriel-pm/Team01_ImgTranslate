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
  return snapshot.exists()
    ? ({ ...DEFAULT_USER_PREFERENCES, ...snapshot.data() } as UserPreferences)
    : null;
}

/**
 * Whether this user's saved images should expire after 7 days. Missing or
 * unreadable means true: if we can't tell what someone chose, deleting is
 * the safer default for their privacy.
 */
export async function getAutoDeleteImages(uid: string): Promise<boolean> {
  try {
    const profile = await getUserProfile(uid);
    return profile?.autoDeleteImages ?? true;
  } catch (error) {
    console.error("[firestore] could not read retention preference", error);
    return true;
  }
}

export async function setAutoDeleteImages(uid: string, value: boolean): Promise<void> {
  // merge: true so this works even for an old profile that predates the field,
  // and never overwrites the user's other preferences.
  await setDoc(doc(db, "users", uid), { autoDeleteImages: value }, { merge: true });
}
