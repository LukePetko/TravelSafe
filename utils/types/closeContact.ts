import { Timestamp } from "firebase/firestore";

export type CloseContact = {
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
