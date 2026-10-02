import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";

import { auth } from "@/lib/firebase";
import { runAuthOperation, toAppUser } from "@/lib/auth";
import { ensureUserProfile } from "@/lib/firestore";

import type { AppUser } from "@/lib/types";

export async function signInWithGoogle(): Promise<AppUser> {
  return runAuthOperation(async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    const credential = await signInWithPopup(auth, provider);
    await ensureUserProfile(credential.user.uid);
    return toAppUser(credential.user)!;
  });
}
