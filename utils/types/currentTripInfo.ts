import { Timestamp } from "firebase/firestore";
import { LatLng } from "react-native-maps";

export type CurrentTripInfo = {
    id: string;
    username: string;
    location:
        | {
              latitude: number;
              longitude: number;
              latitudeDelta: number;
              longitudeDelta: number;
          }
        | undefined
        | null
        | LatLng;
    profilePicture: string;
    tripName: string;
    expoNotificationIds: string[];
    createdAt?: Timestamp;
    updatedAt?: Timestamp;
};
