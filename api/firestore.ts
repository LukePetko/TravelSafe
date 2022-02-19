import {
    addDoc,
    collection,
    doc,
    GeoPoint,
    getDoc,
    setDoc,
} from "firebase/firestore";
import { db } from "../Firebase";
import { BasicUserInfo } from "../utils/types/basicUserInfo";

export const createUserAccount = async (
    id: string,
    userInfo: BasicUserInfo,
) => {
    const user = {
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

    const userDoc = doc(db, "users", id);
    return await setDoc(userDoc, user)
        .then(() => true)
        .catch(() => false);
};

export const getUserById = async (id: string) => {
    const userDoc = doc(db, "users", id);
    const userSnap = await getDoc(userDoc);

    if (userSnap.exists()) {
        return userSnap.data();
    } else {
        return null;
    }
};
