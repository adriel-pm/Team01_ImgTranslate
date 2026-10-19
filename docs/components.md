# UI components

Usage examples for the shared component library. All live in `components/ui/`.

## Button

The only button in the app — every clickable action should use this, not a raw `<button>`. Centralizing it is what makes the 44×44px minimum touch target and focus ring guaranteed everywhere, instead of copy-pasted and eventually drifting out of sync.

```tsx
import Button from "@/components/ui/Button";

<Button onClick={handleSubmit}>Save changes</Button>
```

**Variants:** `variant="primary"` (default — the main action on a screen; use exactly one per view) and `variant="ghost"` (lower-emphasis actions, e.g. a Cancel next to a primary Confirm). Check `buttonStyles.ts` for the full variant list if you need something other than these two.

**Full width**, for stacked layouts like the auth forms:

```tsx
<Button fullWidth onClick={handleSignIn}>Sign in</Button>
```

**Loading state** — shows a spinner, disables the button, and announces progress to screen readers without changing the button's visible width:

```tsx
<Button isLoading loadingLabel="Saving">Save changes</Button>
```

Sighted users keep seeing "Save changes"; a screen reader announces "Saving" instead. Pass `loadingLabel` as the verb for whatever's actually happening — the default is a generic "Working," which is fine for one-off actions but worth overriding anywhere the label would clarify what the user is waiting on (e.g. `loadingLabel="Signing in"`).

**Don't** pass `type="submit"` by accident inside a form unless you mean it — `Button` defaults to `type="button"`, which is a deliberate override of the native HTML default (an untyped `<button>` inside a `<form>` submits it). Pass `type="submit"` explicitly on the one button in a form that should actually submit it.

## Card

A plain bordered container for grouping related content.

```tsx
import Card from "@/components/ui/Card";

<Card>
  <h2 className="text-lg font-semibold text-ink">Section title</h2>
  <p className="mt-2 text-sm text-muted">Body content goes here.</p>
</Card>
```

`className` is optional, for one-off spacing/width adjustments on a specific usage.

## Input

A labelled text field — never render a raw `<input>` directly. The wrapper exists because three accessibility details are easy to get right once and easy to forget every time: a real `<label>` (placeholder text disappears the moment someone types, and most screen readers ignore it anyway), the error/hint text wired up via `aria-describedby` so it's actually read aloud on focus, and `aria-invalid` so assistive tech announces a failing field as failing.

```tsx
import Input from "@/components/ui/Input";

<Input label="Email" type="email" name="email" />
```

**`label` is required** — there's no unlabelled variant, on purpose.

**Hint text**, shown under the field when there's no error:

```tsx
<Input label="Password" type="password" hint="At least 8 characters" />
```

**Error state** — passing `error` switches on error styling and replaces any `hint` with the error message, announced immediately via `role="alert"`:

```tsx
<Input label="Email" type="email" error="Enter a valid email address" />
```

Every other native `<input>` prop (`type`, `name`, `value`, `onChange`, `placeholder`, etc.) passes straight through.

**Don't** pass your own `id` — `Input` generates one internally via `useId()` and wires it to the label and the error/hint text automatically. A manually passed `id` would be silently overwritten, since the component's own generated id is what the label and `aria-describedby` actually point at.

## Modal

An accessible dialog: traps focus while open, closes on Escape, and returns focus to whatever opened it when closed.

```tsx
import { useState } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

function Example() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open modal</Button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Confirm action">
        <p className="text-sm text-muted">Are you sure you want to do this?</p>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button onClick={() => setIsOpen(false)}>Confirm</Button>
        </div>
      </Modal>
    </>
  );
}
```

**Required props:** `isOpen` (boolean), `onClose` (called on Escape or any close action you wire up), `title` (used as the accessible dialog label — always pass a real, specific title, not generic text like "Modal").

**Don't** render a `<button>` inside the modal that also triggers `onClose` without calling it explicitly — `Modal` only closes via Escape or whatever `onClose` calls you add yourself; there's no built-in backdrop-click-to-close by default.

## Spinner

A standalone loading indicator. `Button` has its own built-in spinner for the `isLoading` prop — use this one anywhere else a loading state needs to show outside a button (e.g. a full-page loading state, or inline next to text).

```tsx
import Spinner from "@/components/ui/Spinner";

<div className="flex items-center gap-2">
  <Spinner />
  <span className="text-sm text-muted">Loading…</span>
</div>
```

Pass a custom size via `className` (default is `h-4 w-4`):

```tsx
<Spinner className="h-8 w-8 text-accent" />
```