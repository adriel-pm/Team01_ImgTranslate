"use client";

import useAuth from "@/hooks/useAuth";
import useAutoDeleteImages from "@/hooks/useAutoDeleteImages";

function ImageRetentionSetting() {
  const { user } = useAuth();
  const { autoDelete, isLoading, isSaving, error, setAutoDelete } = useAutoDeleteImages();

  if (!user) return null;

  if (user.isGuest) {
    return (
      <section className="mt-6">
        <h2 className="text-sm font-medium text-ink">Saved images</h2>
        <p className="mt-1 text-sm text-muted">
          Guest sessions don&apos;t save images or history, so there is nothing to delete. Create an
          account if you want to keep your work.
        </p>
      </section>
    );
  }

  return (
    <section className="mt-6">
      {/* WHY fieldset + legend + radios: it is the native pattern for a group of
          exclusive choices, so screen readers announce the group name and
          "1 of 2" without any extra ARIA. */}
      <fieldset disabled={isLoading || isSaving} className="disabled:opacity-60">
        <legend className="text-sm font-medium text-ink">Saved images</legend>
        <p id="retention-help" className="mt-1 text-sm text-muted">
          Images you add are saved to your account. This only affects images you add from now on;
          images already saved keep the setting they were saved with.
        </p>
        <div className="mt-3 flex flex-col gap-1">
          <label className="flex min-h-touch items-center gap-3 text-sm text-ink">
            <input
              type="radio"
              name="image-retention"
              checked={autoDelete}
              onChange={() => void setAutoDelete(true)}
              aria-describedby="retention-help"
            />
            Delete my saved images after 7 days (default)
          </label>
          <label className="flex min-h-touch items-center gap-3 text-sm text-ink">
            <input
              type="radio"
              name="image-retention"
              checked={!autoDelete}
              onChange={() => void setAutoDelete(false)}
              aria-describedby="retention-help"
            />
            Keep my saved images
          </label>
        </div>
      </fieldset>
      <p role="status" className="mt-2 min-h-5 text-sm text-muted">
        {isSaving ? "Saving…" : ""}
      </p>
      {error && (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      )}
    </section>
  );
}

export default ImageRetentionSetting;
