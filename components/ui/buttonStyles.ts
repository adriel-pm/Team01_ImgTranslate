/**
 * Button styling, shared by <Button> (a client component) and <LinkButton>
 * (a server component).
 *
 * WHY this is its own file instead of living in Button.tsx:
 * Button.tsx starts with "use client". Next.js replaces every export of a
 * "use client" module with a client *reference* — a proxy the server cannot
 * execute. So a server component importing `buttonClasses` from Button.tsx
 * would crash at render time with a confusing serialization error.
 *
 * Rule for the team: anything a server component needs to actually CALL must
 * live in a file with no "use client" directive.
 */

export type ButtonVariant = "primary" | "secondary" | "ghost";

/** Shared by every variant: sizing, focus target, disabled behaviour. */
const baseStyles = [
  "inline-flex items-center justify-center gap-2",
  "min-h-touch px-4 py-2.5", // min-h-touch is the 44px token from tailwind.config.ts
  "rounded-control text-[15px] font-medium",
  "transition-colors duration-150",
  "disabled:cursor-not-allowed disabled:opacity-50",
].join(" ");

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-accent text-paper hover:bg-accent-hover active:bg-accent-press",
  secondary: "border border-line bg-paper text-ink hover:bg-wash active:bg-line",
  ghost: "text-muted hover:bg-wash hover:text-ink",
};

/**
 * Build the class string for a button-looking element.
 *
 * Never wrap a <button> in a <Link> to get a clickable button — that nests two
 * interactive elements, which is invalid HTML and makes screen readers announce
 * the control twice. Use <LinkButton> to navigate, <Button> to act.
 */
export function buttonClasses(
  variant: ButtonVariant = "primary",
  fullWidth = false,
  extra = "",
): string {
  return [baseStyles, variantStyles[variant], fullWidth ? "w-full" : "", extra]
    .filter(Boolean)
    .join(" ");
}
