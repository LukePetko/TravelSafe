import {
    collection,
    collectionGroup,
    doc,
    DocumentData,
    DocumentReference,
    getDoc,
    onSnapshot,
    Query,
    query,
    setDoc,
    where,
} from "firebase/firestore";
import { db } from "../../Firebase";
import store from "../../redux/store";
import { getUser } from "../../redux/stores/user";
import { BasicUserInfo } from "../../utils/types/basicUserInfo";
import { CloseContact, PublicUser, User } from "../../utils/types/user";

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

    const publicUser: PublicUser = {
        id,
        username: userInfo.username,
        email: userInfo.email,

        followers: [],
        following: [],

        postCount: 0,
        followerCount: 0,
        followingCount: 0,

        profilePicture: "",

        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const currentTrip = {
        id,
        location: null,
        username: userInfo.username,
        profilePicture: "",
        tripName: "",

        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const userDoc: DocumentReference<DocumentData> = doc(db, "users", id);
    const publicUserDoc: DocumentReference<DocumentData> = doc(
        db,
        "users",
        id,
        "public",
        "profile",
    );
    const currentTripDoc: DocumentReference<DocumentData> = doc(
        db,
        "users",
        id,
        "closeContacts",
        "currentTrip",
    );
    const result = await setDoc(userDoc, user)
        .then(() => true)
        .catch(() => false);

    if (result) {
        await setDoc(publicUserDoc, publicUser);
        await setDoc(currentTripDoc, currentTrip);
    }

    return result;
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

export const getUserDocById = (id: string): DocumentReference<DocumentData> => {
    return doc(db, "users", id);
};

export const getPublicUserDocById = (
    id: string,
): DocumentReference<DocumentData> => {
    return doc(db, "users", id, "public", "profile");
};

export const getPublicUserById = async (
    id: string,
): Promise<DocumentData | null> => {
    const userDoc: DocumentReference<DocumentData> = doc(
        db,
        "users",
        id,
        "public",
        "profile",
    );
    const userSnap: DocumentData = await getDoc(userDoc);

    if (userSnap.exists()) {
        return userSnap.data();
    } else {
        return null;
    }
};

export const updateProfilePicture = async (
    id: string,
    profilePicture: string,
): Promise<boolean> => {
    const userDoc: DocumentReference<DocumentData> = doc(db, "users", id);
    const publicUserDoc: DocumentReference<DocumentData> = doc(
        db,
        "users",
        id,
        "public",
        "profile",
    );
    const currentTripDoc: DocumentReference<DocumentData> = doc(
        db,
        "users",
        id,
        "closeContacts",
        "currentTrip",
    );

    const userSnap: DocumentData = await getDoc(userDoc);
    const publicUserSnap: DocumentData = await getDoc(publicUserDoc);
    const currentTripSnap: DocumentData = await getDoc(currentTripDoc);

    if (
        userSnap.exists() &&
        publicUserSnap.exists() &&
        currentTripSnap.exists()
    ) {
        const user: User = userSnap.data() as User;
        const publicUser: PublicUser = publicUserSnap.data() as PublicUser;
        const currentTrip: DocumentData = currentTripSnap.data();

        const updatedUser: User = {
            ...user,
            profilePicture,
            updatedAt: new Date(),
        };
        const updatedPublicUser: PublicUser = {
            ...publicUser,
            profilePicture,
            updatedAt: new Date(),
        };
        const updatedCurrentTrip: DocumentData = {
            ...currentTrip,
            profilePicture,
            updatedAt: new Date(),
        };

        const result = await setDoc(userDoc, updatedUser)
            .then(() => true)
            .then(() => setDoc(publicUserDoc, updatedPublicUser))
            .then(() => setDoc(currentTripDoc, updatedCurrentTrip))
            .then(() => true)
            .catch(() => false);

        return result;
    } else {
        return false;
    }
};

export const getCloseContactsQuery = async (
    id: string,
): Promise<Query<DocumentData> | undefined> => {
    const userDoc: DocumentReference<DocumentData> = doc(db, "users", id);
    const userSnap: DocumentData = await getDoc(userDoc);

    const user = getUser(store.getState());

    const closeContactsIds: string[] = user.closeContacts.map((el) => el.id);

    if (closeContactsIds.length === 0) {
        return undefined;
    }

    return query(
        collectionGroup(db, "closeContacts"),
        where("id", "in", closeContactsIds),
    );
};
