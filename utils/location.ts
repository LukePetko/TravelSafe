import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";

const TASK_NAME = "background-location-task";

TaskManager.defineTask(TASK_NAME, ({ data, error }) => {
    if (error) {
        console.log(error);
        return;
    }

    console.log(data);
});

// 2 start the task
Location.startLocationUpdatesAsync(TASK_NAME, {
    accuracy: Location.Accuracy.Highest,
    distanceInterval: 10, // minimum change (in meters) betweens updates
    deferredUpdatesInterval: 1000, // minimum interval (in milliseconds) between updates
    // foregroundService is how you get the task to be updated as often as would be if the app was open
    foregroundService: {
        notificationTitle: "Using your location",
        notificationBody:
            "To turn off, go back to the app and switch something off.",
    },
});

// Location.hasStartedLocationUpdatesAsync(TASK_NAME).then((value) => {
//     if (value) {
//         Location.stopLocationUpdatesAsync(TASK_NAME);
//     }
// });
