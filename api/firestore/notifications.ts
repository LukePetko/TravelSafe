import {
    collection,
    doc,
    DocumentData,
    DocumentReference,
    getDoc,
    getDocs,
    query,
    serverTimestamp,
    setDoc,
    updateDoc,
    where,
} from "firebase/firestore";
import { db } from "../../Firebase";
import { getUserById } from "./accounts";

/**
 * Get the user's notifications
 * @param id user's id
 * @returns get notifications data
 */
export const getUserNotifications = async (
    id: string,
): Promise<DocumentData[] | null> => {
    const data: DocumentData[] = [];
    const notificationsQuery = query(
        collection(db, "notifications"),
        where("receiverId", "==", id),
        where("status", "==", 0),
    );

    const notificationsSnap = await getDocs(notificationsQuery);

    notificationsSnap.forEach((notificationSnap: DocumentData) => {
        if (notificationSnap.exists()) {
            data.push(notificationSnap.data());
        }
    });

    return data === [] ? null : data;
};

/**
 * Get the user's sent notifications
 * @param id user's id
 * @returns get sent notifications data
 */
export const getSentNotifications = async (
    id: string,
): Promise<DocumentData[] | null> => {
    const data: DocumentData[] = [];
    const notificationsQuery = query(
        collection(db, "notifications"),
        where("senderId", "==", id),
        where("status", "==", 0),
    );

    const notificationsSnap = await getDocs(notificationsQuery);

    notificationsSnap.forEach((notificationSnap: DocumentData) => {
        if (notificationSnap.exists()) {
            data.push(notificationSnap.data());
        }
    });

    return data === [] ? null : data;
};

/**
 * create a close contact notification
 * @param senderId id of the sender
 * @param receiverId id of the receiver
 */
export const createCloseContactNotification = async (
    senderId: string,
    receiverId: string,
): Promise<void> => {
    const notificationDoc: DocumentReference<DocumentData> = doc(
        db,
        "notifications",
        `${senderId}${receiverId}`,
    );

    const sender = await getUserById(senderId);

    const senderUsername = sender?.username;
    const senderProfilePicture = sender?.profilePicture;

    const receiver = await getUserById(receiverId);

    const receiverUsername = receiver?.username;
    const receiverProfilePicture = receiver?.profilePicture;

    const notificationData: DocumentData = {
        senderId,
        senderUsername,
        senderProfilePicture,
        receiverId,
        receiverUsername,
        receiverProfilePicture,
        status: 0,
        type: 1,
        createdAt: serverTimestamp(),
    };

    await setDoc(notificationDoc, notificationData);
};

/**
 * Send a location notification to the close contacts
 * @param senderId id of the sender
 * @param receiverIds id of the receivers
 */
export const createLocationNotification = async (
    senderId: string,
    receiverIds: string[],
): Promise<void> => {
    const sender = await getUserById(senderId);

    const senderUsername = sender?.username;
    const senderProfilePicture = sender?.profilePicture;
    const time = new Date().getTime();

    receiverIds.forEach(async (receiverId: string) => {
        const notificationDoc: DocumentReference<DocumentData> = doc(
            db,
            "notifications",
            `${senderId}${receiverId}loc${time}`,
        );

        const receiver = await getUserById(receiverId);

        const receiverUsername = receiver?.username;
        const receiverProfilePicture = receiver?.profilePicture;

        const notificationData: DocumentData = {
            senderId,
            senderUsername,
            senderProfilePicture,
            receiverId,
            receiverUsername,
            receiverProfilePicture,
            status: 0,
            type: 2,
            time,
            createdAt: serverTimestamp(),
        };

        setDoc(notificationDoc, notificationData);
    });
};

/**
 * Create a like notification for a post creator
 * @param senderId id of the sender
 * @param receiverId id of the receiver
 * @param postId id of the post
 */
export const createLikeNotification = async (
    senderId: string,
    receiverId: string,
    postId: string,
): Promise<void> => {
    const sender = await getUserById(senderId);

    const senderUsername = sender?.username;
    const senderProfilePicture = sender?.profilePicture;

    const receiver = await getUserById(receiverId);

    const receiverUsername = receiver?.username;
    const receiverProfilePicture = receiver?.profilePicture;

    const notificationDoc: DocumentReference<DocumentData> = doc(
        db,
        "notifications",
        `${senderId}${receiverId}${postId}`,
    );

    const notificationData: DocumentData = {
        senderId,
        senderUsername,
        senderProfilePicture,
        receiverId,
        receiverUsername,
        receiverProfilePicture,
        status: 0,
        type: 3,
        postId,
        createdAt: serverTimestamp(),
    };

    setDoc(notificationDoc, notificationData);
};

/**
 * Accept incoming notification
 * @param senderId id of the sender
 * @param receiverId id of the receiver
 * @param time time of the accepting
 * @param postId id of the post (if post notification)
 */
export const acceptNotification = async (
    senderId: string,
    receiverId: string,
    time: number | null,
    postId: string | null,
): Promise<void> => {
    const notificationDoc: DocumentReference<DocumentData> = doc(
        db,
        "notifications",
        `${senderId}${receiverId}${time ? "loc" + time : ""}${postId ?? ""}`,
    );

    const userDoc: DocumentReference<DocumentData> = doc(
        db,
        "users",
        receiverId,
    );

    const userSnap: DocumentData = await getDoc(userDoc);

    const sender = await getUserById(senderId);

    const senderUsername = sender?.username;
    const senderProfilePicture = sender?.profilePicture;

    if (userSnap.exists()) {
        const user = userSnap.data();
        const newUser = {
            ...user,
            closeContacts: [
                ...user.closeContacts,
                {
                    id: senderId,
                    username: senderUsername,
                    profilePicture: senderProfilePicture,
                },
            ],
        };

        await updateDoc(userDoc, newUser);
    }

    await updateDoc(notificationDoc, {
        status: 1,
    });
};
