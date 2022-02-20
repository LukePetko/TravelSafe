import { GeoPoint } from "firebase/firestore";

export type User = {
    id: string;
    username: string;
    email: string;

    birthDate: Date;

    lastLocation?: GeoPoint;

    followers: string[];
    following: string[];
    closeContacts: string[];

    postCount: number;
    followerCount: number;
    followingCount: number;
    closeContactCount: number;

    profilePicture: string;

    createdAt: Date;
    updatedAt: Date;
};
