type Trip = {
    id?: string;
    user_id: string;

    name: string;
    description: string;

    holiday_id?: string;

    start_date: Date;
    end_date: Date;

    start_place: { lat: string; long: string } | null;
    end_place: { lat: string; long: string } | null;

    thumbnail: string;

    invited_users?: string[];

    created_at: Date;
    updated_at: Date;
};
