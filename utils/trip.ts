import * as Location from "expo-location";
import {
    doc,
    GeoPoint,
    serverTimestamp,
    Timestamp,
    updateDoc,
} from "firebase/firestore";
import { createTrip, startTrip } from "../api/firestore";
import { Trip } from "./types/trip";
import store from "../redux/store";
import { getDistance, getPath, getTripId } from "../redux/stores/trip";
import { getUserId } from "../redux/stores/user";
import { endTrip as endTripAPI } from "../api/firestore";
import { db } from "../Firebase";

export const startNewQuickTrip = async () => {
    const state = store.getState();
    const userId = getUserId(state);
    const location = await Location.getCurrentPositionAsync({});
    const trip: Trip = {
        userId,
        name: "Quick Trip",
        startTime: Timestamp.fromDate(new Date()),

        status: "active",

        createdAt: Timestamp.fromDate(new Date()),
        updatedAt: Timestamp.fromDate(new Date()),

        thumbnail:
            "https://images.unsplash.com/photo-1642543492493-f57f7047be73?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    };

    const geoPoint = new GeoPoint(
        location.coords.latitude,
        location.coords.longitude,
    );

    const tripId = await createTrip(trip);
    await startTrip(userId, geoPoint, trip.name);

    return tripId;
};

export const endTrip = async () => {
    const state = store.getState();
    const userId = getUserId(state);
    const tripId = getTripId(state);
    const path = getPath(state);
    const distance = getDistance(state);

    const tripDoc = doc(db, `users`, userId, "trips", tripId);

    updateDoc(tripDoc, {
        path: JSON.stringify(path),
        distance: distance,
        status: "ended",
        endTime: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });

    const response = await endTripAPI(userId);
    return response;
};
