"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import AuthForm from "@/components/auth/AuthForm";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";
import GuestButton from "@/components/auth/GuestButton";
import useAuth from "@/hooks/useAuth";

function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user) {
      router.replace("/home");
    }
  }, [loading, user, router]);

  return (
    <main id="main" className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-16">
      <h1 className="text-2xl font-semibold tracking-tight text-ink">Log in</h1>
      <p className="mt-2 text-[15px] text-muted">Welcome back.</p>

      <div className="mt-8">
        <AuthForm mode="login" />
      </div>

      <div className="my-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-line" aria-hidden="true" />
        <span className="text-sm text-muted">or</span>
        <span className="h-px flex-1 bg-line" aria-hidden="true" />
      </div>

      <div className="flex flex-col gap-3">
        <GoogleSignInButton onError={setError} />
        <GuestButton onError={setError} />
      </div>

      {error && (
        <p role="alert" className="mt-3 text-sm text-danger">
          {error}
        </p>
      )}

      <p className="mt-8 text-[15px] text-muted">
        No account yet?{" "}
        <Link href="/signup" className="font-medium text-accent underline underline-offset-2">
          Create one
        </Link>
      </p>
    </main>
  );
}

export default LoginPage;