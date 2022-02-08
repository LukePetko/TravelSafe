// subcollection of Trip
type ActiveTrip = {
    id: number;
    trip_id: number;
    user_id: number;

    name: string;

    distance: number;
    start_time: Date;

    location: {lat: string, long: string};

    created_at: Date;
    updated_at: Date;
}