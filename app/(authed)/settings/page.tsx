"use client";

import { useEffect, useState } from "react";
import VoiceFirstToggle from "@/components/accessibility/VoiceFirstToggle";
import ImageRetentionSetting from "@/components/settings/ImageRetentionSetting";
import useAuth from "@/hooks/useAuth";
import { getUserProfile } from "@/lib/firestore";

function SettingsPage() {
  const { user } = useAuth();
  const [voiceFirstEnabled, setVoiceFirstEnabled] = useState(false);

  useEffect(() => {
    if (!user) return;

    getUserProfile(user.uid).then((profile) => {
      if (profile) {
        setVoiceFirstEnabled(profile.voiceFirstEnabled);
      }
    });
  }, [user]);

  return (
    <main id="main" className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-2xl font-semibold tracking-tight text-ink">
        Settings
      </h1>

      <section className="mt-8">
        <h2 className="text-sm font-medium text-ink">Language</h2>
        <p className="mt-1 text-sm text-muted">
          Set your default on the Translate page — it&apos;s remembered
          automatically.
        </p>
      </section>

      <section className="mt-6">
        <h2 className="text-sm font-medium text-ink">Mode</h2>
        <p className="mt-1 text-sm text-muted">
          Switch between Auto, Text only, and Objects only on the
          Translate page.
        </p>
      </section>

      <section className="mt-6">
        <h2 className="text-sm font-medium text-ink">Accessibility</h2>
        <div className="mt-2">
          <VoiceFirstToggle
            enabled={voiceFirstEnabled}
            onChange={setVoiceFirstEnabled}
          />
        </div>
      </section>

      <ImageRetentionSetting />
    </main>
  );
}

export default SettingsPage;
