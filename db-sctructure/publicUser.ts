import { FollowUser } from "../utils/types/user";

// Subcollection of User
type PublicUser = {
    id: number;
    name: string;

    followers: FollowUser[];
    following: FollowUser[];

    profile_picture: string;

    created_at: Date;
    updated_at: Date;
};
