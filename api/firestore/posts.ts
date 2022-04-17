import {
    addDoc,
    collection,
    CollectionReference,
    doc,
    DocumentData,
    DocumentReference,
    getDocs,
    Query,
    query,
    serverTimestamp,
    setDoc,
    where,
} from "firebase/firestore";
import { db } from "../../Firebase";
import { Post } from "../../utils/types/post";
import { uploadPostImage } from "../storage";
import "react-native-get-random-values";
import { v4 } from "uuid";
import { getUser } from "../../redux/stores/user";
import store from "../../redux/store";

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

    const user = await getUser(store.getState());

    const images = imageFiles.map(async (imageFile: File) => {
        return await uploadPostImage(
            imageFile,
            postId,
            imageFiles.indexOf(imageFile),
        );
    });

    console.log(user.username, user.profilePicture);

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

            createdAt: new Date(),
            updatedAt: new Date(),
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
