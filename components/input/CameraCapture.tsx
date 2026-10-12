"use client";
interface CameraCaptureProps {
  onImageSelected: (file: File) => void;
}
function CameraCapture(_props: CameraCaptureProps) {
  return <p className="text-sm text-muted">Camera capture coming soon.</p>;
}
export default CameraCapture;