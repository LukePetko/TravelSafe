import {
    ref,
    getDownloadURL,
    uploadBytes,
    deleteObject,
} from "firebase/storage";
import { storage } from "../Firebase";

export const uploadProfileImage = async (data: File | Blob, userID: string) => {
    const photosRef = ref(storage, `profile_pictures/${userID}.jpg`);
    const result = await uploadBytes(photosRef, data);
    return await getDownloadURL(result.ref);
};

export const uploadPostImage = async (
    data: File | Blob,
    postId: string,
    imageNumber: number,
) => {
    const photosRef = ref(storage, `posts/${postId}/${imageNumber}.jpg`);
    const result = await uploadBytes(photosRef, data);
    return await getDownloadURL(result.ref);
};

export const uploadThumbnail = async (
    data: File | Blob,
    id: string | number,
    userId: string,
) => {
    const photosRef = ref(storage, `thumbnails/${userId}/${id}.jpg`);
    const result = await uploadBytes(photosRef, data);
    return await getDownloadURL(result.ref);
};

export const removeThumbnail = async (url: string) => {
    const photosRef = ref(storage, url);
    await deleteObject(photosRef);
};
