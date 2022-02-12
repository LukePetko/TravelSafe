type User = {
    id: number;
    name: string;
    email: string;

    gender: string;
    birth_date: Date;

    last_location: {lat: string, long: string} | null;

    followers: number[];
    following: number[];
    close_contacts: number[];

    post_count: number;

    profile_picture: string;

    created_at: Date;
    updated_at: Date;
}