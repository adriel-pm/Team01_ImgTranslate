import { sendPasswordResetEmail } from "firebase/auth";

import { auth } from "@/lib/firebase";
import { runAuthOperation } from "@/lib/auth";

/**
 * Sends a password reset email. Deliberately succeeds silently even when
 * the email isn't registered -- the response must not reveal whether an
 * account exists, same reasoning as the login error message.
 */
export async function sendPasswordReset(email: string): Promise<void> {
  return runAuthOperation(async () => {
    try {
      await sendPasswordResetEmail(auth, email.trim());
    } catch (error) {
      const code =
        typeof error === "object" && error !== null && "code" in error
          ? String((error as { code: unknown }).code)
          : "";
      if (code === "auth/user-not-found") return; // swallow on purpose
      throw error;
    }
  });
}