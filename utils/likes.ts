import {
    getPublicUserById,
    getUserById,
    createLikeNotification,
    likePost,
} from "../api/firestore";
import { sendPushNotification } from "./notifications";
import { PublicUser, User } from "./types/user";

export const handleLike = async (
    userId: string,
    postId: string,
    creatorId: string,
): Promise<boolean> => {
    likePost(userId, postId);

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
