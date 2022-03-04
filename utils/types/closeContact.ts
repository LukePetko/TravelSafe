export type CloseContact = {
    username: string;
    location: {
        latitude: number;
        longitude: number;
        latitudeDelta: number;
        longitudeDelta: number;
    } | null;
    profilePicture: string;
    createdAt: Date;
    updatedAt: Date;
};
