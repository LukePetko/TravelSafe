type Post = {
    id: number;
    user_id: number;
    text: string;

    trip_id: number;
    photos: string[];

    tagged_users: number[];

    created_at: Date;
    updated_at: Date;
}