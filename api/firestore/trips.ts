import {
    addDoc,
    collection,
    CollectionReference,
    deleteDoc,
    doc,
    DocumentData,
    DocumentReference,
    GeoPoint,
    getDoc,
    getDocs,
    orderBy,
    query,
    setDoc,
    where,
} from "firebase/firestore";
import { db } from "../../Firebase";
import store from "../../redux/store";
import { addStartTime, addTripName } from "../../redux/stores/trip";
import { Holiday } from "../../utils/types/holiday";
import { Trip } from "../../utils/types/trip";

/**
 * Get the created trips by user id
 * @param id id of the user
 * @returns get all created user trips
 */
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

/**
 * Get the ended trips by user id
 * @param id id of the user
 * @returns get all ended user trips
 */
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

/**
 * Start users trip
 * @param id id of the user
 * @param location current location of the user
 * @param tripName name of the trip
 * @param tripId id of the trip
 * @returns a `boolean` whether the trip is created successfully
 */
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

/**
 * Set trip as active
 * @param userId id of the user
 * @param tripId id of the trip
 * @returns a `boolean` whether the trip is ended successfully
 */
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

/**
 * End users trip
 * @param id id of the user
 * @returns a `boolean` whether the trip is ended successfully
 */
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
            location: {
                latitude: 0.0,
                longitude: 0.0,
            },
            tripName: null,
            updatedAt: new Date(),
        };

        return await setDoc(currentTripDoc, updatedLocation)
            .then(() => true)
            .catch(() => false);
    }
    return false;
};

/**
 * Update current trip of the user
 * @param id id of the user
 * @param location current location of the user
 * @returns a `boolean` whether the trip is updated successfully
 */
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

/**
 * Create new trip
 * @param trip trip object to be created
 * @returns id of the trip
 */
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

/**
 * Create users holiday
 * @param holiday holiday object to be created
 * @returns id of the holiday
 */
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

/**
 * Update users trip
 * @param trip trip object to be updated
 * @returns a `boolean` whether the trip is updated successfully
 */
export const updateTrip = async (trip: Trip): Promise<boolean> => {
    const tripDoc: DocumentReference<DocumentData> = doc(
        db,
        "users",
        trip.userId,
        "trips",
        trip.id!,
    );

    const tripSnap: DocumentData = await getDoc(tripDoc);

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

/**
 * Update users holiday
 * @param holiday holiday object to be updated
 * @returns a `boolean` whether the holiday is updated successfully
 */
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

/**
 * get trips from the holiday
 * @param id id of the user
 * @param holidayId id of the holiday
 * @returns array of trips
 */
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

/**
 * get users holidays
 * @param id id of the user
 * @returns array of holidays
 */
export const getUserHoliday = async (id: string): Promise<Holiday[]> => {
    const holidayQuery = query(
        collection(db, "users", id, "holidays"),
        orderBy("startTime", "desc"),
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

/**
 * delete trip by id
 * @param id id of the user
 * @param tripId id of the trip
 * @returns
 */
export const deleteTrip = async (id: string, tripId: string): Promise<void> => {
    const tripDoc: DocumentReference<DocumentData> = doc(
        db,
        "users",
        id,
        "trips",
        tripId,
    );

    return await deleteDoc(tripDoc);
};

/**
 * delete holiday by id
 * @param id id of the user
 * @param holidayId id of the holiday
 * @returns
 */
export const deleteHoliday = async (
    id: string,
    holidayId: string,
): Promise<void> => {
    const holidayDoc: DocumentReference<DocumentData> = doc(
        db,
        "users",
        id,
        "holidays",
        holidayId,
    );

    const tripQuery = query(
        collection(db, "users", id, "trips"),
        where("holidayId", "==", holidayId),
    );

    const trips = await getDocs(tripQuery);

    trips.forEach((trip: DocumentData) => {
        if (trip.exists()) {
            const updatedTrip: DocumentData = {
                ...trip.data(),
                holidayId: null,
            };
            setDoc(trip.ref, updatedTrip);
        }
    });

    return await deleteDoc(holidayDoc);
};
