import { Timestamp } from "firebase/firestore";
import { FollowUser } from "./user";

export type Comment = {
    id?: string;
    userId: string;
    postId: string;
    content: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
};

export type Post = {
    id?: string;
    userId: string;
    username: string;
    userProfilePicture: string;
    tripId: string | null;

    description: string;
    images: string[];

    likes: FollowUser[];
    comments: Comment[];

    createdAt: Timestamp;
    updatedAt: Timestamp;
};
