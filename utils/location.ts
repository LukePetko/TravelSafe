import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import { GeoPoint } from "firebase/firestore";
import { updateUserFile } from "../api/firestore";
import store from "../redux/store";
import { getUserId } from "../redux/stores/user";

type Object = {
    [key: string]: any;
};

// export const BACKGROUND_LOCATION_TASK = "background-location-task";

// TaskManager.unregisterAllTasksAsync();

// TaskManager.defineTask(BACKGROUND_LOCATION_TASK, ({ data, error }) => {
//     if (error) {
//         console.log(error);
//         return;
//     }

//     const newData: any = { ...data };

//     console.log(data);
//     console.log("heelo");
//     updateUserFile(
//         getUserId(store.getState()).payload,
//         "lastLocation",
//         new GeoPoint(
//             newData.locations[0].coords.latitude,
//             newData.locations[0].coords.longitude,
//         ),
//     );
//     // TaskManager.unregisterTaskAsync(BACKGROUND_LOCATION_TASK);
// });

// // 2 start the task
// export const startTracking = Location.startLocationUpdatesAsync(
//     BACKGROUND_LOCATION_TASK,
//     {
//         accuracy: Location.Accuracy.Highest,
//         distanceInterval: 100, // minimum change (in meters) betweens updates
//         deferredUpdatesInterval: 1000, // minimum interval (in milliseconds) between updates
//         // foregroundService is how you get the task to be updated as often as would be if the app was open
//         foregroundService: {
//             notificationTitle: "Using your location",
//             notificationBody:
//                 "To turn off, go back to the app and switch something off.",
//         },
//     },
// );
