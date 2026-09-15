"use client";

import { createContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "@/lib/firebase";
import { toAppUser } from "@/lib/auth";

import type { AppUser } from "@/lib/types";

/**
 * Auth state shared by the whole app.
 *
 * WHY a context instead of calling onAuthStateChanged inside each hook:
 * every call opens its own listener. With a nav bar, a page and a guard all
 * subscribing, you get three listeners, three re-render cascades and three
 * chances for them to disagree about who is signed in. One listener at the root
 * means one source of truth.
 *
 * This is the ViewModel layer of our MVVM split: lib/auth.ts is the Model
 * (talks to Firebase), this provider holds state, components just render.
 */

export interface AuthContextValue {
  /** The signed-in user, or null when nobody is signed in. */
  user: AppUser | null;
  /**
   * True until Firebase has restored any persisted session.
   *
   * Important: `user === null && loading === true` means "we don't know yet",
   * which is NOT the same as "signed out". Redirecting during loading would
   * bounce every returning user to the login page on every refresh.
   */
  loading: boolean;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    /**
     * onAuthStateChanged fires:
     *   - once shortly after mount, with the restored session or null
     *   - again on every sign-in and sign-out
     *   - again when the ID token is refreshed (roughly hourly)
     *
     * It returns its own unsubscribe function, which we return from the effect
     * so React tears the listener down on unmount. Skipping that leaks a
     * listener on every hot reload in development.
     */
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(toAppUser(firebaseUser));
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Memoised so consumers don't re-render on every parent render just because
  // a fresh object literal was created.
  const value = useMemo<AuthContextValue>(() => ({ user, loading }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
