const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
const ACCEPTED_FORMATS = ["image/jpeg", "image/png", "image/bmp", "image/heic"];

export interface ImageValidationResult {
  valid: boolean;
  error?: string;
}

export function validateImageFile(file: File): ImageValidationResult {
  if (!ACCEPTED_FORMATS.includes(file.type)) {
    return { valid: false, error: "That file type isn't supported. Use JPEG, PNG, BMP, or HEIC." };
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { valid: false, error: "That image is too large. Keep it under 10MB." };
  }
  return { valid: true };
}