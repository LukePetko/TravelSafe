import {
    collection,
    doc,
    DocumentData,
    DocumentReference,
    getDoc,
    getDocs,
    orderBy,
    Query,
    query,
    setDoc,
    Timestamp,
    where,
} from "firebase/firestore";
import { db } from "../../Firebase";
import { Post } from "../../utils/types/post";
import { uploadPostImage } from "../storage";
import "react-native-get-random-values";
import { v4 } from "uuid";
import { getUser } from "../../redux/stores/user";
import store from "../../redux/store";
import { getUserById } from "./accounts";
import { User } from "../../utils/types/user";

export const createPost = async (
    userId: string,
    tripId: string | null,
    description: string,
    imageFiles: File[],
): Promise<boolean> => {
    const postId = v4();

    const postDocumentRef: DocumentReference<DocumentData> = doc(
        db,
        "posts",
        postId,
    );

    const user = (await getUserById(userId)) as User;

    const images = imageFiles.map(async (imageFile: File) => {
        return await uploadPostImage(
            imageFile,
            postId,
            imageFiles.indexOf(imageFile),
        );
    });

    Promise.all(images).then(async (images: string[]) => {
        const post: Post = {
            id: postId,
            userId,
            username: user.username,
            userProfilePicture: user.profilePicture,
            tripId,
            description,
            images,

            likes: [],
            comments: [],

            createdAt: Timestamp.fromDate(new Date()),
            updatedAt: Timestamp.fromDate(new Date()),
        };

        return await setDoc(postDocumentRef, post)
            .then(() => true)
            .catch(() => false);
    });

    return true;
};

export const getPosts = async (userId: string): Promise<DocumentData[]> => {
    const postsQuery: Query<DocumentData> = query(
        collection(db, "posts"),
        where("userId", "==", userId),
    );

    const posts = await getDocs(postsQuery);

    const postsData: DocumentData[] = [];

    posts.forEach((post: DocumentData) => {
        if (post.exists()) {
            postsData.push(post.data());
        }
    });

    return postsData;
};

export const getPostsFromUsers = async (
    userIds: string[],
): Promise<DocumentData[]> => {
    if (userIds.length === 0) {
        return [];
    }

    const postsQuery: Query<DocumentData> = query(
        collection(db, "posts"),
        where("userId", "in", userIds),
        orderBy("createdAt", "desc"),
    );

    const posts = await getDocs(postsQuery);

    const postsData: DocumentData[] = [];

    posts.forEach((post: DocumentData) => {
        if (post.exists()) {
            postsData.push(post.data());
        }
    });

    return postsData;
};

export const likePost = async (
    userId: string,
    postId: string,
): Promise<boolean> => {
    const postDocumentRef: DocumentReference<DocumentData> = doc(
        db,
        "posts",
        postId,
    );

    const post = (await getDoc(postDocumentRef)).data() as Post;

    if (post.likes.map((u) => u.id).includes(userId)) {
        return false;
    }

    const user = (await getUserById(userId)) as User;

    post.likes.push({
        id: userId,
        username: user.username,
        profilePicture: user.profilePicture,
    });

    return await setDoc(postDocumentRef, post)
        .then(() => true)
        .catch(() => false);
};

export const removeLikePost = async (
    userId: string,
    postId: string,
): Promise<boolean> => {
    const postDocumentRef: DocumentReference<DocumentData> = doc(
        db,
        "posts",
        postId,
    );

    const post = (await getDoc(postDocumentRef)).data() as Post;

    if (!post.likes.map((u) => u.id).includes(userId)) {
        return false;
    }

    post.likes = post.likes.filter((u) => u.id !== userId);

    return await setDoc(postDocumentRef, post)
        .then(() => true)
        .catch(() => false);
};
