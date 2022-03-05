import { GeoPoint } from "firebase/firestore";

export type Trip = {
    id?: string;
    userId: string;
    name: string;
    holidayId?: string;
    startTime: Date;
    endTime?: Date;

    startPlace: GeoPoint;
    endPlace?: GeoPoint;

    description?: string;

    invitedUsers?: string[];

    notifyCloseContacts: boolean;

    thumbnail?: string;

    createdAt: Date;
    updatedAt: Date;
};
