import {
    addDoc,
    collection,
    CollectionReference,
    doc,
    DocumentData,
    DocumentReference,
    GeoPoint,
    getDoc,
    onSnapshot,
    setDoc,
} from "firebase/firestore";
import { db } from "../../Firebase";
import { CurrentTripInfo } from "../../utils/types/currentTripInfo";
import { Trip } from "../../utils/types/trip";
import { getUserDocById } from "./accounts";

export const getUserTripData = async (
    id: string,
): Promise<DocumentData | null> => {
    const userDoc: DocumentReference<DocumentData> = doc(
        db,
        "users",
        id,
        "closeContacts",
        "currentTrip",
    );

    const userSnap: DocumentData = await getDoc(userDoc);

    if (userSnap.exists()) {
        return userSnap.data();
    } else {
        return null;
    }
};

export const getUserTripDocumentRef = (
    id: string,
): DocumentReference<DocumentData> => {
    return doc(db, "users", id, "closeContacts", "currentTrip");
};

export const startTrip = async (
    id: string,
    location: GeoPoint | undefined,
    tripName: string,
): Promise<boolean> => {
    const currentTripDoc: DocumentReference<DocumentData> = doc(
        db,
        "users",
        id,
        "closeContacts",
        "currentTrip",
    );
    const locationSnap: DocumentData = await getDoc(currentTripDoc);

    if (locationSnap.exists()) {
        const currentTrip: DocumentData = locationSnap.data();
        const updatedLocation: DocumentData = {
            ...currentTrip,
            location,
            tripName,
            updatedAt: new Date(),
        };
        return await setDoc(currentTripDoc, updatedLocation)
            .then(() => true)
            .catch(() => false);
    } else {
        return false;
    }
};

export const endTrip = async (id: string): Promise<boolean> => {
    const currentTripDoc: DocumentReference<DocumentData> = doc(
        db,
        "users",
        id,
        "closeContacts",
        "currentTrip",
    );
    const locationSnap: DocumentData = await getDoc(currentTripDoc);

    if (locationSnap.exists()) {
        const currentTrip: DocumentData = locationSnap.data();
        const updatedLocation: DocumentData = {
            ...currentTrip,
            location: null,
            tripName: null,
            updatedAt: new Date(),
        };

        return await setDoc(currentTripDoc, updatedLocation)
            .then(() => true)
            .catch(() => false);
    }
    return false;
};

export const updateLocation = async (
    id: string,
    location: GeoPoint,
): Promise<boolean> => {
    const currentTripDoc: DocumentReference<DocumentData> = doc(
        db,
        "users",
        id,
        "closeContacts",
        "currentTrip",
    );
    const locationSnap: DocumentData = await getDoc(currentTripDoc);

    if (locationSnap.exists()) {
        const currentTrip: DocumentData = locationSnap.data();
        const updatedLocation: DocumentData = {
            ...currentTrip,
            location,
            updatedAt: new Date(),
        };
        return await setDoc(currentTripDoc, updatedLocation)
            .then(() => true)
            .catch(() => false);
    } else {
        return false;
    }
};

export const createTrip = async (trip: Trip): Promise<string> => {
    const tripDoc: CollectionReference<DocumentData> = collection(
        db,
        "users",
        trip.userId,
        "trips",
    );

    const result = await addDoc(tripDoc, trip).then((docRef) => {
        return docRef.id;
    });

    return result;
};
