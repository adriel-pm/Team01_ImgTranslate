import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

import { storage } from "@/lib/firebase";
import { getAutoDeleteImages } from "@/lib/firestore";

/**
 * Uploads an image under the user's own folder and returns a download URL.
 *
 * WHY two top-level folders: a bucket lifecycle rule can only match on an
 * object-name prefix, and the user id sat in the middle of the old path
 * (users/{uid}/images/). Putting the retention choice first lets one rule
 * ("delete anything under expiring/ after 7 days") cover every user without
 * touching images people chose to keep.
 *
 * The choice is made at upload time, so changing the setting later only
 * affects images saved afterward.
 */
export async function uploadImage(file: File, uid: string): Promise<string> {
  const autoDelete = await getAutoDeleteImages(uid);
  const folder = autoDelete ? "expiring" : "kept";
  const path = `${folder}/${uid}/${Date.now()}-${file.name}`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

export async function deleteImage(path: string): Promise<void> {
  await deleteObject(ref(storage, path));
}
