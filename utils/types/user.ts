import { GeoPoint, Timestamp } from "firebase/firestore";

export type FollowUser = {
    id: string;
    username: string;
    profilePicture: string;
};

export type CloseContact = {
    id: string;
    username: string;
    profilePicture: string;
};

export type User = {
    id: string;
    username: string;
    email: string;

    birthDate: Timestamp;

    lastLocation?: GeoPoint;

    followers: FollowUser[];
    following: FollowUser[];
    closeContacts: CloseContact[];

    postCount: number;
    followerCount: number;
    followingCount: number;
    closeContactCount: number;

    profilePicture: string;

    createdAt: Timestamp;
    updatedAt: Timestamp;
};

export type PublicUser = {
    id: string;
    username: string;
    email: string;

    followers: FollowUser[];
    following: FollowUser[];

    postCount: number;
    followerCount: number;
    followingCount: number;

    profilePicture: string;

    createdAt: Timestamp;
    updatedAt: Timestamp;
};
