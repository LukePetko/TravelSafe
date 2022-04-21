import * as Location from "expo-location";
import { doc, GeoPoint, serverTimestamp, updateDoc } from "firebase/firestore";
import { createTrip, startTrip } from "../api/firestore";
import { Trip } from "./types/trip";
import store from "../redux/store";
import { getDistance, getPath, getTripId, start } from "../redux/stores/trip";
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
        startTime: new Date(),
        startPlace: new GeoPoint(
            location.coords.latitude,
            location.coords.longitude,
        ),

        status: "active",

        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const tripId = await createTrip(trip);
    await startTrip(userId, trip.startPlace, trip.name);

    return tripId;
};

export const endTrip = async () => {
    const state = store.getState();
    const userId = getUserId(state);
    const tripId = getTripId(state);
    const path = await getPath(state);
    const distance = await getDistance(state);

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
