import {
    ref,
    getDownloadURL,
    uploadBytes,
    uploadString,
} from "firebase/storage";
import { storage } from "../Firebase";

export const uploadProfileImage = async (data: File, userID: string) => {
    const photosRef = ref(storage, `profile_pictures/${userID}.jpg`);
    const result = await uploadBytes(photosRef, data);
    return await getDownloadURL(result.ref);
};
