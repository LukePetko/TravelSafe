import {
    collection,
    deleteDoc,
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
import { getUserById } from "./accounts";
import { User } from "../../utils/types/user";

/**
 * Create a new post for a user
 * @param userId id of the user
 * @param tripId id of the trip
 * @param description trip description
 * @param imageFiles post images
 * @returns a `boolean` indicating if the post was created successfully
 */
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

/**
 * Get all the posts from user
 * @param userId id of the user
 * @returns posts of user
 */
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

/**
 * Get all the posts from the users
 * @param userIds ids of the users
 * @returns posts of users
 */
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

/**
 * like a users post
 * @param userId id of the user
 * @param postId id of the post
 * @returns a `boolean` indicating if the post was deleted successfully
 */
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

/**
 * Remove a like from a users post
 * @param userId id of the user
 * @param postId id of the post
 * @returns a `boolean` indicating if the post was deleted successfully
 */
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

/**
 * delete a users post
 * @param postId id of the post
 * @returns
 */
export const deletePost = async (postId: string): Promise<void> => {
    const postDocumentRef: DocumentReference<DocumentData> = doc(
        db,
        "posts",
        postId,
    );

    return await deleteDoc(postDocumentRef);
};
