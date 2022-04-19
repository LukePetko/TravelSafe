import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";
import { addLocationToPath, saveLocationToFirestore } from "../utils/location";

export const BACKGROUND_FIRESTORE_LOCATION_TASK =
    "background-firestore-location-task";
export const BACKGROUND_PATH_LOCATION_TASK = "background-path-location-task";

export const startLocationTracking = async (id: string): Promise<void> => {
    TaskManager.defineTask(
        BACKGROUND_FIRESTORE_LOCATION_TASK,
        saveLocationToFirestore,
    );

    // TaskManager.defineTask(BACKGROUND_PATH_LOCATION_TASK, addLocationToPath);

    Location.startLocationUpdatesAsync(BACKGROUND_FIRESTORE_LOCATION_TASK, {
        accuracy: Location.Accuracy.Highest,
        distanceInterval: 10,
        foregroundService: {
            notificationTitle: "Using your location",
            notificationBody:
                "To turn off, go back to the app and switch something off.",
        },
    });

    // Location.startLocationUpdatesAsync(BACKGROUND_PATH_LOCATION_TASK, {
    //     accuracy: Location.Accuracy.Highest,
    //     distanceInterval: 20,
    //     foregroundService: {
    //         notificationTitle: "Using your location",
    //         notificationBody:
    //             "To turn off, go back to the app and switch something off.",
    //     },
    // });
};

export const stopLocationTracking = async (): Promise<void> => {
    Location.stopLocationUpdatesAsync(BACKGROUND_FIRESTORE_LOCATION_TASK);
    // Location.stopLocationUpdatesAsync(BACKGROUND_PATH_LOCATION_TASK);
};
