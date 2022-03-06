import * as Location from "expo-location";
import { GeoPoint } from "firebase/firestore";
import { createTrip, startTrip } from "../api/firestore";
import { Trip } from "./types/trip";
import store from "../redux/store";
import { start } from "../redux/stores/trip";
import { getUserId } from "../redux/stores/user";
import { endTrip as endTripAPI } from "../api/firestore";

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

        notifyCloseContacts: false,

        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const tripId = await createTrip(trip);
    start(tripId);
    console.log(await startTrip(userId, trip.startPlace, trip.name));

    return tripId;
};

export const endTrip = async () => {
    const state = store.getState();
    const userId = getUserId(state);
    // const tripId = state.trip.trip.payload;

    const response = await endTripAPI(userId);
    return response;
};
