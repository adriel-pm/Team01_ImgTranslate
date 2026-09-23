import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";

import { auth } from "@/lib/firebase";
import { runAuthOperation, toAppUser } from "@/lib/auth";
import { ensureUserProfile } from "@/lib/firestore";

import type { AppUser } from "@/lib/types";

export async function signUpWithEmail(
  email: string,
  password: string,
  displayName?: string,
): Promise<AppUser> {
  return runAuthOperation(async () => {
    const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);

    if (displayName?.trim()) {
      try {
        await updateProfile(credential.user, { displayName: displayName.trim() });
      } catch (error) {
        console.warn("[auth] account created but display name was not saved", error);
      }
    }

    await ensureUserProfile(credential.user.uid);
    return toAppUser(credential.user)!;
  });
}

export async function signInWithEmail(email: string, password: string): Promise<AppUser> {
  return runAuthOperation(async () => {
    const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
    return toAppUser(credential.user)!;
  });
}