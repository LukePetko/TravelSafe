import {
    collection,
    collectionGroup,
    doc,
    DocumentData,
    DocumentReference,
    getDoc,
    getDocs,
    query,
    updateDoc,
    where,
} from "firebase/firestore";
import { useEffect } from "react";
import { db } from "../../Firebase";

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

    if (userSnap.exists()) {
        const user = userSnap.data();
        const newUser = {
            ...user,
            closeContacts: [...user.closeContacts, senderId],
        };

        await updateDoc(userDoc, newUser);
    }

    await updateDoc(notificationDoc, {
        status: 1,
    });
};
