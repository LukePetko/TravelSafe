import { Timestamp } from "firebase/firestore";

export type BasicUserInfo = {
    username: string;
    email: string;
    birthDate: Timestamp;
    profilePicture: string;
};
