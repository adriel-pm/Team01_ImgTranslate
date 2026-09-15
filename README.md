# ImgTranslate

Point a camera at text you can't read. ImgTranslate extracts the text, translates it, describes what else is in the frame, and reads all of it aloud.

CIS 454, Syracuse University. Team TM01 — Adriel Pacheco, Chad Saunders, Mark Vu, Andy.

Continues the design work from CIS 453: use cases, activity diagrams, CRC cards, class diagram and sequence diagrams. Those artifacts live in `/docs`.

---

## Status

| Sprint | Theme | Status |
| --- | --- | --- |
| 1 | Scaffolding and auth | In progress |
| 2 | UI shell and routing | Not started |
| 3 | Image input | Not started |
| 4 | OCR (Google Vision) | Not started |
| 5 | Translation (Google Translate) | Not started |
| 6 | Object identification (Gemini) | Not started |
| 7 | Text-to-speech and voice-first mode | Not started |
| 8 | Correction UI | Not started |
| 9 | Area selection and language detection | Not started |
| 10 | History and preferences | Not started |
| 11 | PWA and offline | Not started |
| 12 | Testing, polish, deploy | Not started |

Live app: _add the Vercel URL here once S1-13 is done._

---

## Running it locally

You need Node.js 20 or newer.

```bash
git clone https://github.com/<org-or-user>/imgtranslate.git
cd imgtranslate
npm install
cp .env.example .env.local
# paste the real Firebase values into .env.local
npm run dev
```

Open http://localhost:3000.

The Firebase values are in the team's shared secure note. They are not in this repo. If `npm run dev` throws `Firebase config is incomplete`, `.env.local` is missing a value — the error names which one.

### Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server with hot reload |
| `npm run build` | Production build. Run this before opening a PR |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript with no emit |
| `npm run format` | Prettier, writes in place |

---

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 14, App Router |
| Language | TypeScript, strict mode |
| Styling | Tailwind CSS |
| Auth | Firebase Authentication |
| Database | Firestore (Sprint 2) |
| File storage | Firebase Storage (Sprint 3) |
| OCR | Google Cloud Vision API (Sprint 4) |
| Translation | Google Cloud Translation API (Sprint 5) |
| Scene description | Google Gemini API (Sprint 6) |
| Text-to-speech | Web Speech API (Sprint 7) |
| Hosting | Vercel |

---

## Project layout

```
app/              Routes. One folder per URL segment, page.tsx per route
  api/            Server-side API routes. All secret keys live here (Sprint 4+)
components/       Views. JSX and as little logic as possible
  ui/             Button, Input, LinkButton — the shared primitives
  auth/           Auth-specific views
  providers/      React context providers
hooks/            ViewModels. State and side effects for the views
lib/              Models and services. Anything that talks to an external API
docs/             Design notes and the CIS 453 diagrams
artifacts/        Screenshots and evidence linked from Jira worklogs
```

This mirrors the CIS 453 class diagram on purpose: boundary classes became components, control classes became `lib/` modules, entity classes became types in `lib/types.ts`.

---

## Conventions

- TypeScript strict mode. No `any`.
- Component props typed with an `interface` declared above the component. Default export at the bottom.
- Functional components with hooks. No class components.
- File names: `PascalCase.tsx` for components, `camelCase.ts` for everything else.
- Imports in order: React/Next, third-party, `@/` absolute, relative, types, styles.
- Comments explain **why**, not what.
- Every interactive element gets an accessible name, a visible focus state, and a 44×44px minimum hit area.
- Never use color alone to carry meaning.

### Secrets

`NEXT_PUBLIC_*` variables are compiled into the browser bundle. That is correct for the Firebase config, which is public by design and protected by Security Rules.

Google Cloud and Gemini keys must **never** get that prefix. From Sprint 4 those calls go through `app/api/*/route.ts` so the key stays on the server. If you find yourself adding `NEXT_PUBLIC_` to make a fetch work, that is the bug.

---

## Branches and pull requests

`main` is always deployable. Every change goes through a branch and a PR with one approval.

```
feat/s1-google-signin       new feature
fix/s1-guest-redirect       bug fix
docs/s1-readme              docs only
chore/s1-eslint-config      tooling
```

Commit messages: `type(scope): what changed`, e.g. `feat(auth): add guest sign-in`.

Reference the Jira key in the PR description (`TM01-12`) so the work is traceable at grading time.

CI runs typecheck, lint and build on every PR. A red build does not get merged.

---

## Accessibility

A blind user pointing a camera at a scene is a primary user of this app, not an afterthought. Every sprint carries its own accessibility work; none of it is deferred to Sprint 12.

Sprint 7 adds voice-first mode: a stripped-down interface with one large control, automatic text-to-speech on every result, and full keyboard operation.
