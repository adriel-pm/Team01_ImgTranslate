"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { signInWithEmail, signUpWithEmail } from "@/lib/authEmail";

type AuthMode = "login" | "signup";

interface AuthFormProps {
  mode: AuthMode;
  redirectTo?: string;
}

interface FieldErrors {
  email?: string;
  password?: string;
}

function AuthForm({ mode, redirectTo = "/home" }: AuthFormProps) {
  const router = useRouter();

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isSignup = mode === "signup";

  function validate(): FieldErrors {
    const errors: FieldErrors = {};
    if (!email.trim()) errors.email = "Enter your email address.";
    else if (!email.includes("@")) errors.email = "That email address isn't formatted correctly.";
    if (!password) errors.password = "Enter your password.";
    else if (isSignup && password.length < 6) errors.password = "Passwords need at least 6 characters.";
    return errors;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const errors = validate();
    setFieldErrors(errors);
    setFormError(null);
    if (Object.keys(errors).length > 0) return;

    setIsSubmitting(true);
    try {
      if (isSignup) {
        await signUpWithEmail(email, password, displayName);
      } else {
        await signInWithEmail(email, password);
      }
      router.replace(redirectTo);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Something went wrong. Try again.");
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      {isSignup && (
        <Input
          label="Name"
          type="text"
          autoComplete="name"
          value={displayName}
          onChange={(event) => setDisplayName(event.target.value)}
          hint="Optional. Shown when you're signed in."
        />
      )}

      <Input
        label="Email"
        type="email"
        autoComplete="email"
        inputMode="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        error={fieldErrors.email}
        required
      />

      <Input
        label="Password"
        type="password"
        autoComplete={isSignup ? "new-password" : "current-password"}
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        error={fieldErrors.password}
        hint={isSignup ? "At least 6 characters." : undefined}
        required
      />

      {formError && (
        <p role="alert" className="rounded-control border border-danger/30 bg-danger/5 px-3 py-2 text-sm text-danger">
          {formError}
        </p>
      )}

      <Button type="submit" fullWidth isLoading={isSubmitting} loadingLabel={isSignup ? "Creating your account" : "Logging you in"}>
        {isSignup ? "Create account" : "Log in"}
      </Button>
    </form>
  );
}

export default AuthForm;