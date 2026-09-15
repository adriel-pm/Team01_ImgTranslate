"use client";

import { useId, type ComponentPropsWithoutRef } from "react";

/**
 * Labelled text input.
 *
 * WHY a wrapper rather than raw <input>: three accessibility details have to be
 * right every single time, and they are the ones people forget.
 *   1. A real <label htmlFor> -- placeholder text is not a label. It disappears
 *      as soon as the user types and most screen readers ignore it.
 *   2. aria-describedby pointing at the help/error text, so the error is read
 *      out when focus lands on the field, not just seen.
 *   3. aria-invalid, so assistive tech announces the field as failing.
 * Doing this once here means nobody has to remember it later.
 */

interface InputProps extends Omit<ComponentPropsWithoutRef<"input">, "id"> {
  /** Visible label text. Required -- there is no unlabelled variant on purpose. */
  label: string;
  /** Validation or server error for this field. Presence switches on error styling. */
  error?: string;
  /** Static hint shown under the field when there is no error. */
  hint?: string;
}

function Input({ label, error, hint, className = "", ...rest }: InputProps) {
  // useId gives a stable unique id that matches between server and client
  // render. Math.random() here would cause a React hydration mismatch.
  const id = useId();
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  // Point the input at whichever description is actually on screen.
  const describedBy = error ? errorId : hint ? hintId : undefined;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {label}
      </label>

      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={[
          "min-h-touch w-full rounded-control border bg-paper px-3 py-2.5",
          "text-[15px] text-ink placeholder:text-muted/70",
          "transition-colors duration-150",
          error ? "border-danger" : "border-line hover:border-muted/50",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...rest}
      />

      {error ? (
        // role="alert" makes a screen reader announce the message the moment it
        // appears, without the user having to go looking for it.
        <p id={errorId} role="alert" className="text-sm text-danger">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="text-sm text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export default Input;
