import { GeoPoint } from "firebase/firestore";
import { Alert } from "react-native";
import { updateLocation } from "../api/firestore";
import store from "../redux/store";
import {
    addDistance,
    addLastMovementTime,
    addPoint,
    getDistance,
    getLastMovementTime,
    resetLastMovementTime,
} from "../redux/stores/trip";
import { getUserId } from "../redux/stores/user";
import { inactivityAlert } from "./alers";
import * as Notifications from "expo-notifications";
import { Notification } from "expo-notifications";
import {
    inactiveLocalNotification,
    sendPushNotification,
} from "./notifications";

export const saveLocationToFirestore = async ({ data, error }: any) => {
    if (error) {
        console.log("Error in background location task: ", error);
        return;
    }

    store.dispatch(addDistance(10));
    store.dispatch(resetLastMovementTime());
    const distance = getDistance(store.getState());
    // console.log(distance);

    // console.log(data);

    const userId = getUserId(store.getState());
    if (userId && distance % 200 === 0) {
        await updateLocation(
            userId,
            new GeoPoint(
                data.locations[0].coords.latitude,
                data.locations[0].coords.longitude,
            ),
        );
    }

    addLocationToPath({ data, error });
};

export const addLocationToPath = ({ data, error }: any) => {
    if (error) {
        console.log("Error in background location task: ", error);
        return;
    }

    // console.log(data);
    // console.log("tu");

    store.dispatch(
        addPoint({
            latitude: data.locations[0].coords.latitude,
            longitude: data.locations[0].coords.longitude,
        }),
    );
};

export const checkTimer = async () => {
    const time = getLastMovementTime(store.getState());
    console.log(time);

    if (time === 5) {
        inactiveLocalNotification();
        inactivityAlert(() => store.dispatch(resetLastMovementTime()));
    }

    if (time === 10) {
        sendPushNotification("");
    }

    // add push to close contacts

    store.dispatch(addLastMovementTime(1));
};
