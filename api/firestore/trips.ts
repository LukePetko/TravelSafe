import {
    addDoc,
    collection,
    CollectionReference,
    doc,
    DocumentData,
    DocumentReference,
    GeoPoint,
    getDoc,
    getDocs,
    onSnapshot,
    orderBy,
    query,
    setDoc,
    where,
} from "firebase/firestore";
import { db } from "../../Firebase";
import store from "../../redux/store";
import { addStartTime, addTripName } from "../../redux/stores/trip";
import { CurrentTripInfo } from "../../utils/types/currentTripInfo";
import { Holiday } from "../../utils/types/holiday";
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

export const getCreatedUserTrips = async (id: string): Promise<Trip[]> => {
    const tripsQuery = query(
        collection(db, "users", id, "trips"),
        where("status", "==", "created"),
        orderBy("startTime", "desc"),
    );

    const trips = await getDocs(tripsQuery);

    const tripsData: Trip[] = [];

    trips.forEach((trip: DocumentData) => {
        if (trip.exists()) {
            tripsData.push({ id: trip.id, ...trip.data() });
        }
    });

    return tripsData;
};

export const getEndedUserTrips = async (id: string): Promise<Trip[]> => {
    const tripsQuery = query(
        collection(db, "users", id, "trips"),
        where("status", "==", "ended"),
        orderBy("startTime", "desc"),
    );

    const trips = await getDocs(tripsQuery);

    const tripsData: Trip[] = [];

    trips.forEach((trip: DocumentData) => {
        if (trip.exists()) {
            tripsData.push({ id: trip.id, ...trip.data() });
        }
    });

    return tripsData;
};

export const startTrip = async (
    id: string,
    location: GeoPoint | undefined,
    tripName: string,
    tripId?: string,
): Promise<boolean> => {
    const currentTripDoc: DocumentReference<DocumentData> = doc(
        db,
        "users",
        id,
        "closeContacts",
        "currentTrip",
    );
    const locationSnap: DocumentData = await getDoc(currentTripDoc);

    if (tripId) {
        const tripDoc: DocumentReference<DocumentData> = doc(
            db,
            "users",
            id,
            "trips",
            tripId,
        );

        const tripSnap: DocumentData = await getDoc(tripDoc);

        if (tripSnap.exists()) {
            await setDoc(tripDoc, {
                ...tripSnap.data(),
                startTime: new Date(),
            });
        }
    }

    if (locationSnap.exists()) {
        const currentTrip: DocumentData = locationSnap.data();
        const updatedLocation: DocumentData = {
            ...currentTrip,
            location,
            tripName,
            updatedAt: new Date(),
        };
        store.dispatch(addTripName(tripName));
        store.dispatch(addStartTime(new Date()));
        return await setDoc(currentTripDoc, updatedLocation)
            .then(() => true)
            .catch(() => false);
    } else {
        return false;
    }
};

export const setTripActive = async (
    userId: string,
    tripId: string,
): Promise<boolean> => {
    const tripDoc: DocumentReference<DocumentData> = doc(
        db,
        "users",
        userId,
        "trips",
        tripId,
    );

    const tripSnap: DocumentData = await getDoc(tripDoc);

    if (tripSnap.exists()) {
        const updatedTrip = {
            ...tripSnap.data(),
            status: "active",
        };

        return await setDoc(tripDoc, updatedTrip)
            .then(() => true)
            .catch(() => false);
    }
    return false;
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

export const createHoliday = async (holiday: Holiday): Promise<string> => {
    const holidayDoc: CollectionReference<DocumentData> = collection(
        db,
        "users",
        holiday.userId,
        "holidays",
    );

    const result = await addDoc(holidayDoc, holiday)
        .then((docRef) => {
            return docRef.id;
        })
        .catch(() => {
            return "";
        });

    return result;
};

export const getCreatedUserHoliday = async (id: string): Promise<Holiday[]> => {
    const holidayQuery = query(
        collection(db, "users", id, "holidays"),
        where("endTime", ">", new Date()),
        // orderBy("startTime", "desc"),
    );

    const holiday = await getDocs(holidayQuery);

    const holidayData: Holiday[] = [];

    holiday.forEach((holiday: DocumentData) => {
        if (holiday.exists()) {
            holidayData.push({ holidayId: holiday.id, ...holiday.data() });
        }
    });

    return holidayData;
};

export const getEndedUserHoliday = async (id: string): Promise<Holiday[]> => {
    const currentDate = new Date();
    const holidayQuery = query(
        collection(db, "users", id, "holidays"),
        where("endTime", "<", currentDate),
        // orderBy("startTime", "desc"),
    );

    const holiday = await getDocs(holidayQuery);

    const holidayData: Holiday[] = [];

    holiday.forEach((holiday: DocumentData) => {
        if (holiday.exists()) {
            holidayData.push({ holidayId: holiday.id, ...holiday.data() });
        }
    });

    return holidayData;
};

export const updateTrip = async (trip: Trip): Promise<boolean> => {
    const tripDoc: DocumentReference<DocumentData> = doc(
        db,
        "users",
        trip.userId,
        "trips",
        trip.id!,
    );

    const tripSnap: DocumentData = await getDoc(tripDoc);

    console.log(tripSnap);

    if (tripSnap.exists()) {
        const updatedTrip = {
            ...tripSnap.data(),
            ...trip,
        };

        return await setDoc(tripDoc, updatedTrip)
            .then(() => true)
            .catch(() => false);
    }
    return false;
};

export const updateHoliday = async (holiday: Holiday): Promise<boolean> => {
    const holidayDoc: DocumentReference<DocumentData> = doc(
        db,
        "users",
        holiday.userId,
        "holidays",
        holiday.holidayId!,
    );

    const holidaySnap: DocumentData = await getDoc(holidayDoc);

    if (holidaySnap.exists()) {
        const updatedHoliday = {
            ...holidaySnap.data(),
            ...holiday,
        };

        return await setDoc(holidayDoc, updatedHoliday)
            .then(() => true)
            .catch(() => false);
    }
    return false;
};

export const getHolidayTrips = async (
    id: string,
    holidayId: string,
): Promise<Trip[]> => {
    const tripQuery = query(
        collection(db, "users", id, "trips"),
        where("holidayId", "==", holidayId),
    );

    const trips = await getDocs(tripQuery);

    const tripData: Trip[] = [];

    trips.forEach((trip: DocumentData) => {
        if (trip.exists()) {
            tripData.push({ tripId: trip.id, ...trip.data() });
        }
    });

    return tripData;
};
