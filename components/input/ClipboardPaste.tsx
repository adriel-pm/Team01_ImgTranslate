"use client";
interface ClipboardPasteProps {
  onImageSelected: (file: File) => void;
}
function ClipboardPaste(_props: ClipboardPasteProps) {
  return <p className="text-sm text-muted">Clipboard paste coming soon.</p>;
}
export default ClipboardPaste;