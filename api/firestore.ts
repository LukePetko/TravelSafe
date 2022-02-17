import { addDoc, collection, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../Firebase";
import { BasicUserInfo } from "../utils/types/basicUserInfo";

export const createUserAccount = async (
    id: string,
    userInfo: BasicUserInfo,
) => {
    const user = {
        id,
        ...userInfo,

        lastLocation: {
            lat: 0,
            lng: 0,
        },

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
    const newUser = await setDoc(userDoc, user);

    // console.log("Created user:", newUser.id);

    return newUser;
};

export const getUserById = async (id: string) => {
    const userDoc = doc(db, "users", id);
    const user = await getDoc(userDoc);

    return user.data();
};
