import { signInAnonymously } from "firebase/auth";

import { auth } from "@/lib/firebase";
import { runAuthOperation, toAppUser } from "@/lib/auth";
import { ensureUserProfile } from "@/lib/firestore";

import type { AppUser } from "@/lib/types";

export async function signInAsGuest(): Promise<AppUser> {
  return runAuthOperation(async () => {
    const credential = await signInAnonymously(auth);
    await ensureUserProfile(credential.user.uid);
    return toAppUser(credential.user)!;
  });
}