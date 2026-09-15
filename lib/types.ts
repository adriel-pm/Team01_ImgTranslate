/**
 * Shared application types.
 *
 * WHY this file exists: our CIS 453 class diagram has three kinds of classes.
 * They map into the codebase like this:
 *
 *   Entity classes   (OCRResult, TextBlock, BoundingBox, TranslationResult,
 *                     SegmentResult, EditRecord, UserPreferences,
 *                     LanguageResult)          -> TypeScript types, here.
 *   Control classes  (OCREngine, TranslationService, CorrectionManager,
 *                     LanguageDetector, ImagePreprocessor, ErrorHandler)
 *                                              -> modules in lib/
 *   Boundary classes (ImageInput, AreaSelector) -> React components/
 *
 * Sprint 1 only needs the user-facing types. The OCR / translation entity types
 * get added in Sprints 4 and 5 when there is real code that consumes them.
 * Do not add them early -- unused types rot.
 */

/**
 * The shape of an authenticated user as the UI cares about it.
 *
 * WHY not just pass Firebase's `User` object around: Firebase's type has ~25
 * fields and ties every component to the Firebase SDK. Mapping to our own small
 * type at the edge means that if we ever swap auth providers, only lib/auth.ts
 * changes.
 */
export interface AppUser {
  /** Firebase UID. This is the document key for users/{uid} in Firestore (Sprint 2). */
  uid: string;
  /** Null for guest (anonymous) accounts, which have no email. */
  email: string | null;
  /** From a Google account, or null for email/password and guest sign-ins. */
  displayName: string | null;
  /** Google profile photo URL, or null. */
  photoURL: string | null;
  /**
   * True when the user signed in through "Continue as guest".
   * Guests can use the app but cannot save history (enforced in Sprint 10).
   */
  isGuest: boolean;
}

/**
 * Persisted user settings. Mirrors the UserPreferences entity class from the
 * CIS 453 class diagram (defaultTargetLang, autoSwitchEnabled, autoDeleteImages).
 *
 * NOT WRITTEN YET. Sprint 2 creates the Firestore document at users/{uid};
 * Sprints 5, 6 and 9 fill in the individual fields as those features land.
 * Declared now so the shape is agreed on before four people build against it.
 */
export interface UserPreferences {
  /** ISO 639-1 code. Product decision: English is the default target language. */
  defaultTargetLang: string;
  /** Sprint 9: switch source language automatically when detection confidence > 0.85. */
  autoSwitchEnabled: boolean;
  /** Sprint 3/10: delete uploaded images from Firebase Storage after processing. */
  autoDeleteImages: boolean;
  /** Sprint 6: "auto" runs OCR and object identification in parallel. Product default. */
  mode: "auto" | "text-only" | "objects-only";
  /** Sprint 7: the stripped-down, TTS-everything interface. */
  voiceFirstEnabled: boolean;
}

/** Defaults applied to a brand-new profile. Used from Sprint 2 onward. */
export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  defaultTargetLang: "en",
  autoSwitchEnabled: true,
  autoDeleteImages: true,
  mode: "auto",
  voiceFirstEnabled: false,
};
