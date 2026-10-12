"use client";
interface FileUploadProps {
  onImageSelected: (file: File) => void;
}
function FileUpload(_props: FileUploadProps) {
  return <p className="text-sm text-muted">File upload coming soon.</p>;
}
export default FileUpload;