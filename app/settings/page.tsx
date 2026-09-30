"use client";

function SettingsPage() {
  return (
    <main id="main" className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-2xl font-semibold tracking-tight text-ink">Settings</h1>

      <section className="mt-8">
        <h2 className="text-sm font-medium text-ink">Language</h2>
        <p className="mt-1 text-sm text-muted">Default target language picker arrives in Sprint 5.</p>
      </section>

      <section className="mt-6">
        <h2 className="text-sm font-medium text-ink">Mode</h2>
        <p className="mt-1 text-sm text-muted">Auto / text-only / objects-only toggle arrives in Sprint 6.</p>
      </section>

      <section className="mt-6">
        <h2 className="text-sm font-medium text-ink">Accessibility</h2>
        <p className="mt-1 text-sm text-muted">Voice-first mode toggle arrives in Sprint 7.</p>
      </section>
    </main>
  );
}

export default SettingsPage;