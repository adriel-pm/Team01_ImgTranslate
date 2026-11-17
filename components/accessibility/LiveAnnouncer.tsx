interface LiveAnnouncerProps {
  message: string | null;
}

/**
 * A visually hidden, screen-reader-announced status region. Whatever gets
 * passed as `message` is read aloud automatically the moment it changes --
 * this is what tells a screen reader user a result just arrived, without
 * them needing to go looking for it.
 */
function LiveAnnouncer({ message }: LiveAnnouncerProps) {
  return (
    <p role="status" aria-live="polite" className="sr-only">
      {message}
    </p>
  );
}

export default LiveAnnouncer;