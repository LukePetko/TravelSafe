import { serverTimestamp } from "firebase/firestore";

export type Comment = {
    id?: string;
    userId: string;
    postId: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
};

export type Post = {
    id?: string;
    userId: string;
    tripId: string | null;

    description: string;
    images: string[];

    likes: string[];
    comments: Comment[];

    createdAt: Date;
    updatedAt: Date;
};
