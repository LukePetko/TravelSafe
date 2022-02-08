// Subcollection of Post
type PostComment = {
    id: number;
    user_id: number;
    text: string;

    post_id: number;

    created_at: Date;
    updated_at: Date;
}