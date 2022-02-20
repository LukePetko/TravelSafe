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

/**
 * Creates a new user doc in the users collection after a first registration
 * @param id ID of the user from firebase auth
 * @param userInfo Other user info
 * @returns a `boolean` if user was created successfully
 */
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

/**
 * Gets a user doc from the users collection based on the user's ID
 * @param id user ID from firebase auth
 * @returns a `User` object
 */
export const getUserById = async (id: string): Promise<DocumentData | null> => {
    const userDoc: DocumentReference<DocumentData> = doc(db, "users", id);
    const userSnap: DocumentData = await getDoc(userDoc);

    if (userSnap.exists()) {
        return userSnap.data();
    } else {
        return null;
    }
};
