import { Timestamp } from "firebase/firestore";

export type CurrentTripInfo = {
    username: string;
    location: {
        latitude: number;
        longitude: number;
        latitudeDelta: number;
        longitudeDelta: number;
    } | null;
    profilePicture: string;
    tripName: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
};
