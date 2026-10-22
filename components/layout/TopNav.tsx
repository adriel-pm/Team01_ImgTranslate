"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import SignOutButton from "@/components/auth/SignOutButton";

const links = [
  { href: "/home", label: "Home" },
  { href: "/history", label: "History" },
  { href: "/settings", label: "Settings" },
];

function TopNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Main" className="border-b border-line">
      <div className="mx-auto flex max-w-2xl items-center justify-between px-6 py-4">
        <span className="text-[15px] font-semibold text-ink">ImgTranslate</span>

        <div className="flex items-center gap-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname === link.href ? "page" : undefined}
              className={
                pathname === link.href
                  ? "text-sm font-medium text-ink"
                  : "text-sm text-muted hover:text-ink"
              }
            >
              {link.label}
            </Link>
          ))}
          <SignOutButton />
        </div>
      </div>
    </nav>
  );
}

export default TopNav;
