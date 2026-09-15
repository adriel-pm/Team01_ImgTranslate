# Sprint 1 — environment and architecture notes

Written during Sprint 1 so the next person to join does not have to reconstruct
any of it. Links from this file are valid worklog evidence for non-code stories.

## Running the app locally

    git clone https://github.com/<org-or-user>/imgtranslate.git
    cd imgtranslate
    npm install
    cp .env.example .env.local     # then paste the real values in
    npm run dev                    # http://localhost:3000

The Firebase values live in the team's shared secure note. They are not in the
repo and never will be — `.env.local` is gitignored.

## Why the code is laid out this way

We are carrying the CIS 453 class diagram forward rather than starting from a
blank architecture. The mapping:

| CIS 453 class type | Example classes                       | Where it lives now |
| ------------------ | ------------------------------------- | ------------------ |
| Boundary           | `ImageInput`, `AreaSelector`          | `components/`      |
| Control            | `OCREngine`, `TranslationService`     | `lib/`             |
| Entity             | `OCRResult`, `TextBlock`, `EditRecord`| `lib/types.ts`     |

This is the MVVM split we committed to: `lib/` holds models and services,
`hooks/` holds the state that views read, `components/` render and nothing more.

## Auth design decisions

- **One `onAuthStateChanged` listener** for the whole app, in
  `components/providers/AuthProvider.tsx`. Multiple listeners disagree with each
  other and re-render everything three times.
- **`loading` is not `signed out`.** Firebase restores the session from
  IndexedDB asynchronously, so `user === null` on first paint means "unknown".
  Every redirect checks `!loading` first.
- **Errors are translated once**, in `lib/auth.ts`. Components never see a
  Firebase error code.
- **`AuthGuard` is UX, not security.** Anyone can edit client JavaScript. Real
  enforcement is Firestore Security Rules in Sprint 2.
- **Guest mode is a real Firebase user** (anonymous auth) with a real UID and no
  way back in once signed out. `SignOutButton` warns guests before ending it.

## Accessibility decisions baked in from day one

- 44×44px minimum on every control, via the `min-h-touch` Tailwind token.
- Visible focus ring on everything focusable, set once in `app/globals.css`.
- Real `<label htmlFor>` on every input — `components/ui/Input.tsx` makes an
  unlabelled input impossible to build by accident.
- Errors use `role="alert"` so they are announced, not just displayed.
- Pinch-zoom is not disabled. `maximumScale` is deliberately absent from the
  viewport config.
- `prefers-reduced-motion` respected globally.

We are not batching accessibility work into Sprint 12. It is cheaper now.

## Known gaps at the end of Sprint 1

- No password reset flow yet.
- No Firestore user profile — Sprint 2, story S2-8.
- Firestore and Storage are still in test mode. **They expire roughly 30 days
  after creation.** Security rules are Sprint 2, story S2-9; do not let this
  slip past Sprint 2 or the app will start failing reads.
- `/home` is a placeholder that exists to prove the session works.
