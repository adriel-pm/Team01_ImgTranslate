/**
 * Firebase client initialisation.
 *
 * This is the ONLY file in the project that calls initializeApp(). Everything
 * else imports `auth` (and later `db` / `storage`) from here.
 *
 * WHY a single module: Firebase throws if you initialise the same app twice.
 * Next.js hot-reloads modules constantly in development, so a naive
 * `initializeApp(config)` at the top of a component will crash on the second
 * save. The getApps() guard below is what makes hot reload survivable.
 */
import { getApps, getApp, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";

/**
 * Read the config from environment variables rather than hard-coding it.
 *
 * NEXT_PUBLIC_ variables are inlined into the browser bundle at BUILD time,
 * not read at runtime. Two consequences worth knowing:
 *   1. Changing .env.local requires restarting `npm run dev`.
 *   2. Adding these in the Vercel dashboard requires a redeploy to take effect.
 *
 * These values being public is expected and fine. Firebase identifies your
 * project with them; it does not authorise anything. Data protection comes from
 * Firestore/Storage Security Rules, which we write in Sprint 2.
 */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

/**
 * Fail loudly and early if the environment is not set up.
 *
 * WHY: without this check, a missing variable produces a Firebase error like
 * "auth/invalid-api-key" the first time somebody clicks "Log in" -- which sends
 * whoever hit it hunting through auth code instead of opening .env.local.
 * A named list of missing keys at startup saves that hour.
 */
const missingKeys = Object.entries(firebaseConfig)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missingKeys.length > 0) {
  throw new Error(
    `Firebase config is incomplete. Missing: ${missingKeys.join(", ")}.\n` +
      `Copy .env.example to .env.local, paste the values from the Firebase ` +
      `Console (Project settings > General > Your apps), then restart the dev server.`,
  );
}

/**
 * Reuse the existing app during hot reload instead of creating a second one.
 * getApps() returns every already-initialised Firebase app in this JS context.
 */
const app: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

/**
 * The Auth instance used across the app.
 *
 * Firebase persists the session in IndexedDB by default, so a signed-in user
 * stays signed in across page reloads and browser restarts. That is why
 * AuthProvider has a `loading` state: on first paint we do not yet know whether
 * a session exists.
 */
export const auth: Auth = getAuth(app);

export default app;

/*
 * Sprint 2 adds, in this file:
 *   import { getFirestore } from "firebase/firestore";
 *   export const db = getFirestore(app);
 *
 * Sprint 3 adds:
 *   import { getStorage } from "firebase/storage";
 *   export const storage = getStorage(app);
 *
 * Do not import those before the sprint that needs them -- each one pulls a
 * few hundred KB into the client bundle.
 */
