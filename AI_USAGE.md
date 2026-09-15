# AI usage disclosure

We used Claude (Anthropic) during Sprint 1 to help scaffold the Next.js project, draft boilerplate configuration, and write the initial pass of code comments explaining design decisions.

**What AI helped with:**
- Initial project scaffolding (Next.js config, Tailwind tokens, ESLint/Prettier setup, CI workflow)
- First-draft implementations of the auth service layer and shared UI components
- Comment drafting explaining the "why" behind decisions already made by the team (e.g., pop-up vs. redirect for Google sign-in, guest-session trade-offs)
- Drafting this Sprint 1 setup documentation and the Jira process checklist

**What the team did:**
- All product decisions (auth methods, guest mode behavior, accessibility requirements, design tokens) were made by the team before any code was written — see `CHAT_HANDOFF.md` and `SPRINT_PLAN.md` in the project history
- Every file was reviewed, and in several cases modified, by the person who owns that story before merging
- Task division, Jira setup, and sprint process follow the course's grading rubrics, applied by the team
- Testing (manual verification against acceptance criteria, on real devices) was done by hand, not by AI

**Why we're noting this here:** the codebase moves faster than a from-scratch first sprint normally would, and we'd rather be upfront about why than have it look unexplained. If your course has a specific AI-use policy for CIS 454, check with the instructor about disclosure format — this file is a starting point, not a substitute for whatever the syllabus requires.
