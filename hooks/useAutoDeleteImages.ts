import { useCallback, useEffect, useState } from "react";

import useAuth from "@/hooks/useAuth";
import { getAutoDeleteImages, setAutoDeleteImages } from "@/lib/firestore";

interface UseAutoDeleteImagesResult {
  autoDelete: boolean;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  setAutoDelete: (value: boolean) => Promise<void>;
}

/**
 * Reads and updates the "delete saved images after 7 days" preference.
 * Guests have no stored preference: they never save images at all.
 */
function useAutoDeleteImages(): UseAutoDeleteImagesResult {
  const { user } = useAuth();
  const uid = user && !user.isGuest ? user.uid : null;

  const [autoDelete, setAutoDeleteState] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!uid) {
      setIsLoading(false);
      return;
    }
    let cancelled = false;
    // getAutoDeleteImages never rejects: it falls back to true on any failure.
    void getAutoDeleteImages(uid).then((value) => {
      if (!cancelled) {
        setAutoDeleteState(value);
        setIsLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [uid]);

  const setAutoDelete = useCallback(
    async (value: boolean) => {
      if (!uid) return;
      const previous = autoDelete;
      setAutoDeleteState(value); // optimistic, so the radio responds instantly
      setIsSaving(true);
      setError(null);
      try {
        await setAutoDeleteImages(uid, value);
      } catch (saveError) {
        console.error("[settings]", saveError);
        setAutoDeleteState(previous);
        setError("Couldn't save that change. Try again.");
      } finally {
        setIsSaving(false);
      }
    },
    [uid, autoDelete],
  );

  return { autoDelete, isLoading, isSaving, error, setAutoDelete };
}

export default useAutoDeleteImages;
