import { GeoPoint, Timestamp } from "firebase/firestore";

export type Trip = {
    id?: string;
    userId: string;
    name: string;
    holidayId?: string | null;
    startTime: Date | Timestamp;
    endTime?: Date | Timestamp;

    startPlace?: GeoPoint;
    endPlace?: GeoPoint;

    description?: string;

    invitedUsers?: string[];

    thumbnail?: string;

    distance?: number;
    path?: GeoPoint[] | string;

    status: string;

    createdAt: Date;
    updatedAt: Date;
};
