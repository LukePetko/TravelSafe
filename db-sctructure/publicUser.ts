// Subcollection of User
type PublicUser = {
    id: number;
    name: string;

    followers: number[];
    following: number[];

    profile_picture: string;

    created_at: Date;
    updated_at: Date;
}