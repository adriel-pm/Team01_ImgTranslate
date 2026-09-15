"use client";

import { useState } from "react";

import GuestButton from "@/components/auth/GuestButton";
import LinkButton from "@/components/ui/LinkButton";
import useAuth from "@/hooks/useAuth";

function LandingPage() {
  const { user, loading } = useAuth();
  const [error, setError] = useState<string | null>(null);

  return (
    <main id="main" className="mx-auto flex min-h-screen max-w-2xl flex-col px-6 py-16 sm:py-24">
      <p className="text-[15px] font-semibold tracking-tight text-ink">ImgTranslate</p>

      <div className="mt-16 sm:mt-24">
        <h1 className="max-w-prose text-4xl font-semibold leading-[1.15] tracking-tight text-ink sm:text-5xl">
          Read anything you can point a camera at.
        </h1>

        <p className="mt-6 max-w-prose text-lg leading-relaxed text-muted">
          Take a photo of a sign, a menu, a label. ImgTranslate pulls out the text, translates it,
          describes what else is in the frame, and reads all of it aloud.
        </p>
      </div>

      <div className="mt-12 flex max-w-xs flex-col gap-3">
        {loading ? (
          <div className="min-h-touch" aria-hidden="true" />
        ) : user ? (
          <LinkButton href="/home" fullWidth>
            Open ImgTranslate
          </LinkButton>
        ) : (
          <>
            <LinkButton href="/signup" fullWidth>
              Get started
            </LinkButton>

            <LinkButton href="/login" variant="secondary" fullWidth>
              Log in
            </LinkButton>

            <GuestButton onError={setError} />
          </>
        )}

        {error && (
          <p role="alert" className="text-sm text-danger">
            {error}
          </p>
        )}
      </div>

      {!loading && !user && (
        <p className="mt-4 max-w-prose text-sm text-muted">
          Guest sessions work straight away, but nothing you translate is saved.
        </p>
      )}

      <div className="flex-1" />

      <footer className="mt-16 border-t border-line pt-6">
        <p className="text-sm text-muted">
          Sprint 1 build. Accounts work; camera, translation and scene description arrive over the
          next few sprints.
        </p>
      </footer>
    </main>
  );
}

export default LandingPage;