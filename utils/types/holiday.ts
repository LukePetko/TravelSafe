import { GeoPoint, Timestamp } from "@firebase/firestore";

export type Holiday = {
    id?: string;
    userId: string;
    name: string;
    holidayId?: string;
    startTime: Timestamp;
    endTime?: Timestamp;

    destination?: GeoPoint;

    description?: string;

    invitedUsers?: string[];

    thumbnail?: string;

    status: string;

    createdAt: Timestamp;
    updatedAt: Timestamp;
};
