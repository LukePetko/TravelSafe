import {
    addDoc,
    collection,
    collectionGroup,
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
import { useEffect } from "react";
import { db } from "../../Firebase";
import { getUserById } from "./accounts";

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

export const acceptNotification = async (
    senderId: string,
    receiverId: string,
): Promise<void> => {
    const notificationDoc: DocumentReference<DocumentData> = doc(
        db,
        "notifications",
        `${senderId}${receiverId}`,
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
