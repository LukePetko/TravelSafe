import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { storage } from "../Firebase";

export const uploadProfileImage = async (data: File | Blob, userID: string) => {
    const photosRef = ref(storage, `profile_pictures/${userID}.jpg`);
    const result = await uploadBytes(photosRef, data);
    return await getDownloadURL(result.ref);
};

export const uploadPostImage = async (
    data: File,
    postId: string,
    imageNumber: number,
) => {
    const photosRef = ref(storage, `posts/${postId}/${imageNumber}.jpg`);
    const result = await uploadBytes(photosRef, data);
    return await getDownloadURL(result.ref);
};
