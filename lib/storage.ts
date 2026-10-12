import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

import { storage } from "@/lib/firebase";

/**
 * Uploads an image under the user's own folder and returns a public
 * download URL. Images live at users/{uid}/images/{filename} so Storage
 * Security Rules can restrict access per-user, same pattern as Firestore.
 */
export async function uploadImage(file: File, uid: string): Promise<string> {
  const path = `users/${uid}/images/${Date.now()}-${file.name}`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

export async function deleteImage(path: string): Promise<void> {
  await deleteObject(ref(storage, path));
}