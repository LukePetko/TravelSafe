import {
    collection,
    collectionGroup,
    DocumentData,
    getDocs,
    query,
    where,
} from "firebase/firestore";
import { db } from "../../Firebase";

export const getUserNotifications = async (
    id: string,
): Promise<DocumentData[] | null> => {
    const data: DocumentData[] = [];
    const notificationsQuery = query(
        collection(db, "users", id, "notifications"),
        where("receiverId", "==", id),
    );

    const notificationsSnap = await getDocs(notificationsQuery);

    notificationsSnap.forEach((notificationSnap: DocumentData) => {
        if (notificationSnap.exists()) {
            data.push(notificationSnap.data());
        }
    });

    return data === [] ? null : data;
};
