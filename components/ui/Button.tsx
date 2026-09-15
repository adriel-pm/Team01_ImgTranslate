"use client";

import { buttonClasses, type ButtonVariant } from "@/components/ui/buttonStyles";

import type { ComponentPropsWithoutRef, ReactNode } from "react";

/**
 * The one button in the app.
 *
 * WHY centralise it: the 44x44px minimum touch target and the focus ring are
 * accessibility requirements we committed to, and requirements that live in
 * four separate copies of a <button> tag do not survive a semester. Any button
 * anywhere in ImgTranslate should come from this file.
 *
 * The class strings themselves live in buttonStyles.ts so that LinkButton, a
 * server component, can use them too. See that file for why.
 */

interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
  /** primary = the main action on the screen. Use exactly one per view. */
  variant?: ButtonVariant;
  /** Stretch to the container width. Used for stacked auth buttons. */
  fullWidth?: boolean;
  /**
   * Shows a spinner and blocks clicks. Pass the verb of what is happening --
   * `loadingLabel` is what a screen reader announces instead of the label.
   */
  isLoading?: boolean;
  loadingLabel?: string;
  children: ReactNode;
}

function Button({
  variant = "primary",
  fullWidth = false,
  isLoading = false,
  loadingLabel = "Working",
  disabled,
  className = "",
  type = "button", // Default to "button": an untyped button inside a form submits it.
  children,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || isLoading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      // aria-busy tells assistive tech the control is mid-action, so a screen
      // reader user knows the tap registered even though nothing visible moved.
      aria-busy={isLoading || undefined}
      className={buttonClasses(variant, fullWidth, className)}
      {...rest}
    >
      {isLoading ? (
        <>
          <Spinner />
          {/* Sighted users keep seeing the original label so the button does not
              jump width; screen readers get the status instead. */}
          <span aria-hidden="true">{children}</span>
          <span className="sr-only">{loadingLabel}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}

/** Small inline spinner. aria-hidden because the button already announces state. */
function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeOpacity="0.3" strokeWidth="2" />
      <path d="M14.5 8A6.5 6.5 0 0 0 8 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default Button;
