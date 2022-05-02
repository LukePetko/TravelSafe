import {
    collectionGroup,
    doc,
    DocumentData,
    DocumentReference,
    getDoc,
    getDocs,
    Query,
    query,
    QuerySnapshot,
    setDoc,
    Timestamp,
    where,
} from "firebase/firestore";
import { db } from "../../Firebase";
import store from "../../redux/store";
import { getUser, getUserId } from "../../redux/stores/user";
import { BasicUserInfo } from "../../utils/types/basicUserInfo";
import { CurrentTripInfo } from "../../utils/types/currentTripInfo";
import { PublicUser, User } from "../../utils/types/user";

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

        createdAt: Timestamp.fromDate(new Date()),
        updatedAt: Timestamp.fromDate(new Date()),
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

        profilePicture: userInfo.profilePicture,

        expoNotificationIds: [],

        createdAt: Timestamp.fromDate(new Date()),
        updatedAt: Timestamp.fromDate(new Date()),
    };

    const currentTrip: CurrentTripInfo = {
        id,
        location: { latitude: 0.0, longitude: 0.0 },
        username: userInfo.username,
        profilePicture: userInfo.profilePicture,
        tripName: "",

        expoNotificationIds: [],

        createdAt: Timestamp.fromDate(new Date()),
        updatedAt: Timestamp.fromDate(new Date()),
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
            updatedAt: Timestamp.fromDate(new Date()),
        };
        const updatedPublicUser: PublicUser = {
            ...publicUser,
            profilePicture,
            updatedAt: Timestamp.fromDate(new Date()),
        };
        const updatedCurrentTrip: DocumentData = {
            ...currentTrip,
            profilePicture,
            updatedAt: Timestamp.fromDate(new Date()),
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

export const getCloseContactsQuery = async (): Promise<
    Query<DocumentData> | undefined
> => {
    // const userDoc: DocumentReference<DocumentData> = doc(db, "users", id);
    // const userSnap: DocumentData = await getDoc(userDoc);

    const user = (await getUserById(getUserId(store.getState()))) as User;

    const closeContactsIds: string[] = user.closeContacts.map((el) => el.id);

    if (closeContactsIds.length === 0) {
        return undefined;
    }

    return query(
        collectionGroup(db, "closeContacts"),
        where("id", "in", closeContactsIds),
    );
};

export const getCloseContacts = async (): Promise<
    CurrentTripInfo[] | undefined
> => {
    const query: Query<DocumentData> | undefined =
        await getCloseContactsQuery();

    if (query === undefined) {
        return undefined;
    }

    const closeContactsSnap: QuerySnapshot<DocumentData> = await getDocs(query);

    if (closeContactsSnap.empty) {
        return undefined;
    }

    const closeContacts: CurrentTripInfo[] = closeContactsSnap.docs.map(
        (docSnap) => docSnap.data() as CurrentTripInfo,
    );

    return closeContacts;
};

export const followUser = async (
    ownId: string,
    userId: string,
): Promise<boolean> => {
    const ownUserDoc: DocumentReference<DocumentData> = doc(db, "users", ownId);
    const userDoc: DocumentReference<DocumentData> = doc(db, "users", userId);

    const ownUserPublicUserDoc: DocumentReference<DocumentData> = doc(
        db,
        "users",
        ownId,
        "public",
        "profile",
    );
    const userPublicUserDoc: DocumentReference<DocumentData> = doc(
        db,
        "users",
        userId,
        "public",
        "profile",
    );

    const ownUserSnap: DocumentData = await getDoc(ownUserDoc);
    const userSnap: DocumentData = await getDoc(userDoc);
    const ownUserPublicUserSnap: DocumentData = await getDoc(
        ownUserPublicUserDoc,
    );
    const userPublicUserSnap: DocumentData = await getDoc(userPublicUserDoc);

    if (ownUserSnap.exists() && userSnap.exists()) {
        const ownUser: User = ownUserSnap.data() as User;
        const user: User = userSnap.data() as User;

        const updatedOwnUser: User = {
            ...ownUser,
            following: [
                ...ownUser.following,
                {
                    id: userId,
                    username: user.username,
                    profilePicture: user.profilePicture,
                },
            ],
            followingCount: ownUser.followingCount + 1,
            updatedAt: Timestamp.fromDate(new Date()),
        };
        const updatedUser: User = {
            ...user,
            followers: [
                ...user.followers,
                {
                    id: ownId,
                    username: ownUser.username,
                    profilePicture: ownUser.profilePicture,
                },
            ],
            followerCount: user.followerCount + 1,
            updatedAt: Timestamp.fromDate(new Date()),
        };
        const updatedOwnUserPublicUser: PublicUser = {
            ...(ownUserPublicUserSnap.data() as PublicUser),
            following: [
                ...ownUser.following,
                {
                    id: userId,
                    username: user.username,
                    profilePicture: user.profilePicture,
                },
            ],
            followingCount: ownUser.followingCount + 1,
            updatedAt: Timestamp.fromDate(new Date()),
        };
        const updatedUserPublicUser: PublicUser = {
            ...(userPublicUserSnap.data() as PublicUser),
            followers: [
                ...user.followers,
                {
                    id: ownId,
                    username: ownUser.username,
                    profilePicture: ownUser.profilePicture,
                },
            ],
            followerCount: user.followerCount + 1,
            updatedAt: Timestamp.fromDate(new Date()),
        };

        const result = await setDoc(ownUserDoc, updatedOwnUser)
            .then(() => setDoc(userDoc, updatedUser))
            .then(() => setDoc(ownUserPublicUserDoc, updatedOwnUserPublicUser))
            .then(() => setDoc(userPublicUserDoc, updatedUserPublicUser))
            .then(() => true)
            .catch(() => false);

        return result;
    } else {
        return false;
    }
};

export const unfollowUser = async (
    ownId: string,
    userId: string,
): Promise<boolean> => {
    const ownUserDoc: DocumentReference<DocumentData> = doc(db, "users", ownId);
    const userDoc: DocumentReference<DocumentData> = doc(db, "users", userId);

    const ownUserPublicUserDoc: DocumentReference<DocumentData> = doc(
        db,
        "users",
        ownId,
        "public",
        "profile",
    );
    const userPublicUserDoc: DocumentReference<DocumentData> = doc(
        db,
        "users",
        userId,
        "public",
        "profile",
    );

    const ownUserSnap: DocumentData = await getDoc(ownUserDoc);
    const userSnap: DocumentData = await getDoc(userDoc);
    const ownUserPublicUserSnap: DocumentData = await getDoc(
        ownUserPublicUserDoc,
    );
    const userPublicUserSnap: DocumentData = await getDoc(userPublicUserDoc);

    if (ownUserSnap.exists() && userSnap.exists()) {
        const ownUser: User = ownUserSnap.data() as User;
        const user: User = userSnap.data() as User;

        const updatedOwnUser: User = {
            ...ownUser,
            following: ownUser.following.filter((el) => el.id !== userId),
            followingCount: ownUser.followingCount - 1,
            updatedAt: Timestamp.fromDate(new Date()),
        };
        const updatedUser: User = {
            ...user,
            followers: user.followers.filter((el) => el.id !== ownId),
            followerCount: user.followerCount - 1,
            updatedAt: Timestamp.fromDate(new Date()),
        };
        const updatedOwnUserPublicUser: PublicUser = {
            ...(ownUserPublicUserSnap.data() as PublicUser),
            following: ownUser.following.filter((el) => el.id !== userId),
            followingCount: ownUser.followingCount - 1,
            updatedAt: Timestamp.fromDate(new Date()),
        };
        const updatedUserPublicUser: PublicUser = {
            ...(userPublicUserSnap.data() as PublicUser),
            followers: user.followers.filter((el) => el.id !== ownId),
            followerCount: user.followerCount - 1,
            updatedAt: Timestamp.fromDate(new Date()),
        };

        const result = await setDoc(ownUserDoc, updatedOwnUser)
            .then(() => setDoc(userDoc, updatedUser))
            .then(() => setDoc(ownUserPublicUserDoc, updatedOwnUserPublicUser))
            .then(() => setDoc(userPublicUserDoc, updatedUserPublicUser))
            .then(() => true)
            .catch(() => false);

        return result;
    } else {
        return false;
    }
};

export const addNotificationId = async (
    userId: string,
    notificationId: string,
): Promise<boolean> => {
    const userDoc: DocumentReference<DocumentData> = doc(
        db,
        "users",
        userId,
        "closeContacts",
        "currentTrip",
    );
    const userSnap: DocumentData = await getDoc(userDoc);

    const publicUserDoc: DocumentReference<DocumentData> = doc(
        db,
        "users",
        userId,
        "public",
        "profile",
    );

    const publicUserSnap: DocumentData = await getDoc(publicUserDoc);

    if (userSnap.exists()) {
        const user: CurrentTripInfo = userSnap.data() as CurrentTripInfo;

        if (user.expoNotificationIds.includes(notificationId)) {
            return true;
        }

        const updatedUser: CurrentTripInfo = {
            ...user,
            expoNotificationIds: [...user.expoNotificationIds, notificationId],
            updatedAt: Timestamp.fromDate(new Date()),
        };

        const updatedPublicUser: PublicUser = {
            ...(publicUserSnap.data() as PublicUser),
            expoNotificationIds: [...user.expoNotificationIds, notificationId],
            updatedAt: Timestamp.fromDate(new Date()),
        };

        const result = await setDoc(userDoc, updatedUser)
            .then(() => setDoc(publicUserDoc, updatedPublicUser))
            .then(() => true)
            .catch(() => false);

        return result;
    }

    return false;
};

export const removeNotificationId = async (
    userId: string,
    notificationId: string,
): Promise<boolean> => {
    const userDoc: DocumentReference<DocumentData> = doc(
        db,
        "users",
        userId,
        "closeContacts",
        "currentTrip",
    );
    const userSnap: DocumentData = await getDoc(userDoc);

    if (userSnap.exists()) {
        const user: CurrentTripInfo = userSnap.data() as CurrentTripInfo;

        const updatedUser: CurrentTripInfo = {
            ...user,
            expoNotificationIds: user.expoNotificationIds.filter(
                (el) => el !== notificationId,
            ),
            updatedAt: Timestamp.fromDate(new Date()),
        };

        const result = await setDoc(userDoc, updatedUser)
            .then(() => true)
            .catch(() => false);

        return result;
    }

    return false;
};
