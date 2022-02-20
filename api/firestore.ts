import {
    doc,
    DocumentData,
    DocumentReference,
    getDoc,
    setDoc,
} from "firebase/firestore";
import { db } from "../Firebase";
import { BasicUserInfo } from "../utils/types/basicUserInfo";
import { User } from "../utils/types/user";

export const createUserAccount = async (
    id: string,
    userInfo: BasicUserInfo,
): Promise<boolean> => {
    const user: User = {
        id,
        ...userInfo,

        followers: [],
        following: [],
        closeContacts: [],

        postCount: 0,
        followerCount: 0,
        followingCount: 0,
        closeContactCount: 0,

        profilePicture: "",

        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const userDoc: DocumentReference<DocumentData> = doc(db, "users", id);
    return await setDoc(userDoc, user)
        .then(() => true)
        .catch(() => false);
};

export const getUserById = async (id: string): Promise<DocumentData | null> => {
    const userDoc: DocumentReference<DocumentData> = doc(db, "users", id);
    const userSnap: DocumentData = await getDoc(userDoc);

    if (userSnap.exists()) {
        return userSnap.data();
    } else {
        return null;
    }
};
