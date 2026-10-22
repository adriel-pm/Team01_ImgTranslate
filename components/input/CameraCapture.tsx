"use client";

import { useEffect, useRef, useState } from "react";

interface CameraCaptureProps {
  onImageSelected: (file: File) => void;
}

function CameraCapture({ onImageSelected }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setError("Your browser doesn't support camera capture. Use the Upload tab instead.");
    }
  }, []);

  // WHY: the <video> element only exists after isActive flips to true, so
  // startCamera() can't attach the stream itself: videoRef.current is still
  // null at that moment. Attach it here, after React has rendered the element.
  useEffect(() => {
    if (isActive && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [isActive]);

  // WHY: switching tabs unmounts this component without calling stopCamera(),
  // which would leave the camera (and its green light) running.
  useEffect(() => {
    return () => streamRef.current?.getTracks().forEach((track) => track.stop());
  }, []);

  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      setIsActive(true);
      setError(null);
    } catch {
      setError("Couldn't access your camera. Check permissions, or use the Upload tab instead.");
    }
  }

  function stopCamera() {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setIsActive(false);
  }

  function capture() {
    const video = videoRef.current;
    // videoWidth is 0 until the first frame arrives; capturing then would produce a blank image.
    if (!video || video.videoWidth === 0) return;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0);

    canvas.toBlob((blob) => {
      if (!blob) return;
      onImageSelected(new File([blob], `capture-${Date.now()}.jpg`, { type: "image/jpeg" }));
      stopCamera();
    }, "image/jpeg");
  }

  return (
    <div>
      {!isActive && (
        <button
          type="button"
          onClick={startCamera}
          className="min-h-touch w-full rounded-control border border-dashed border-line px-4 py-8 text-sm text-muted hover:border-accent hover:text-ink"
        >
          Start camera
        </button>
      )}
      {isActive && (
        <div>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full rounded-control border border-line"
          />
          <div className="mt-3 flex gap-2">
            <button
              onClick={capture}
              className="min-h-touch rounded-control bg-accent px-4 py-2 text-sm font-medium text-paper"
            >
              Capture
            </button>
            <button
              onClick={stopCamera}
              className="min-h-touch rounded-control border border-line px-4 py-2 text-sm text-ink"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {error && (
        <p role="alert" className="mt-2 text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

export default CameraCapture;
