import { Timestamp } from "firebase/firestore";

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
        | null;
    profilePicture: string;
    tripName: string;
    expoNotificationIds: string[];
    createdAt?: Timestamp | Date;
    updatedAt?: Timestamp | Date;
};
