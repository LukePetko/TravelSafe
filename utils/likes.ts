import { getPublicUserById, getUserById } from "../api/firestore";
import { createLikeNotification } from "../api/firestore/notifications";
import { likePost } from "../api/firestore/posts";
import { sendPushNotification } from "./notifications";
import { PublicUser, User } from "./types/user";

export const handleLike = async (
    userId: string,
    postId: string,
    creatorId: string,
): Promise<boolean> => {
    likePost(userId, postId);

    console.log(creatorId);

    const creator: PublicUser = (await getPublicUserById(
        creatorId,
    )) as PublicUser;

    const user: User = (await getUserById(userId)) as User;

    sendPushNotification(
        creator.expoNotificationIds,
        "TravelSafe",
        `${user.username} liked your post`,
    );

    createLikeNotification(userId, creatorId, postId);

    return true;
};
