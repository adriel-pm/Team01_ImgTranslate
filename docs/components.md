# UI components

Usage examples for the shared component library. All live in `components/ui/`.

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