import LinkButton from "@/components/ui/LinkButton";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page not found",
};

/**
 * 404 page. Next.js renders this automatically for any unmatched route.
 *
 * Copy rule we follow across the app: an error says what happened and what to
 * do next. It does not apologise and it does not use a jokey voice.
 */
function NotFound() {
  return (
    <main id="main" className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
      <h1 className="text-2xl font-semibold tracking-tight text-ink">Page not found</h1>
      <p className="mt-2 max-w-prose text-[15px] text-muted">
        That address doesn&apos;t match anything in ImgTranslate. It may have moved.
      </p>

      <div className="mt-8 max-w-xs">
        <LinkButton href="/" fullWidth>
          Back to the start
        </LinkButton>
      </div>
    </main>
  );
}

export default NotFound;
