import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";
import { checkTimer, saveLocationToFirestore } from "../utils/location";
import BackgroundTimer from "react-native-background-timer";
import store from "../redux/store";
import { resetLastMovementTime } from "../redux/stores/trip";

export const BACKGROUND_FIRESTORE_LOCATION_TASK =
    "background-firestore-location-task";

export const startLocationTracking = async (id: string): Promise<void> => {
    TaskManager.defineTask(
        BACKGROUND_FIRESTORE_LOCATION_TASK,
        saveLocationToFirestore,
    );

    Location.startLocationUpdatesAsync(BACKGROUND_FIRESTORE_LOCATION_TASK, {
        accuracy: Location.Accuracy.Highest,
        distanceInterval: 10,
        foregroundService: {
            notificationTitle: "Using your location",
            notificationBody:
                "To turn off, go back to the app and switch something off.",
        },
    });

    BackgroundTimer.runBackgroundTimer(() => checkTimer(), 1000);
};

export const stopLocationTracking = async (): Promise<void> => {
    Location.stopLocationUpdatesAsync(BACKGROUND_FIRESTORE_LOCATION_TASK);
    BackgroundTimer.stopBackgroundTimer();
    store.dispatch(resetLastMovementTime({}));
};
