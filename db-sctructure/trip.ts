type Trip = {
    id: number;
    user_id: number;

    name: string;
    description: string;

    holiday_id: number;

    start_date: Date;
    end_date: Date;

    start_place: {lat: string, long: string};
    end_place: {lat: string, long: string};

    thumbnail: string;

    invited_users: number[];

    created_at: Date;
    updated_at: Date;
}