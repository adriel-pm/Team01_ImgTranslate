import Link from "next/link";

import { buttonClasses, type ButtonVariant } from "@/components/ui/buttonStyles";

import type { ReactNode } from "react";

/**
 * A link that looks like a button.
 *
 * WHY this exists rather than <Link><Button/></Link>: that pattern puts a
 * <button> inside an <a>. It is invalid HTML, screen readers announce the
 * control twice, and keyboard behaviour differs between browsers.
 *
 * Rule of thumb for the team:
 *   navigates to another page -> LinkButton (renders <a>)
 *   does something on this page -> Button (renders <button>)
 */

interface LinkButtonProps {
  href: string;
  variant?: ButtonVariant;
  fullWidth?: boolean;
  className?: string;
  children: ReactNode;
}

function LinkButton({
  href,
  variant = "primary",
  fullWidth = false,
  className = "",
  children,
}: LinkButtonProps) {
  return (
    <Link href={href} className={buttonClasses(variant, fullWidth, className)}>
      {children}
    </Link>
  );
}

export default LinkButton;
