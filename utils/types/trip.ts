import { GeoPoint, Timestamp } from "firebase/firestore";

export type Trip = {
    id?: string;
    userId: string;
    name: string;
    holidayId?: string | null;
    startTime: Timestamp;
    endTime?: Timestamp;

    description?: string;

    invitedUsers?: string[];

    thumbnail?: string;

    distance?: number;
    path?: GeoPoint[] | string;

    status: string;

    createdAt: Timestamp;
    updatedAt: Timestamp;
};
