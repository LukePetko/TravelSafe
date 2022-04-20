import { GeoPoint } from "firebase/firestore";
import { updateLocation } from "../api/firestore";
import store from "../redux/store";
import { addDistance, addPoint, getDistance } from "../redux/stores/trip";
import { getUserId } from "../redux/stores/user";

export const saveLocationToFirestore = async ({ data, error }: any) => {
    if (error) {
        console.log("Error in background location task: ", error);
        return;
    }

    store.dispatch(addDistance(10));
    const distance = getDistance(store.getState());
    // console.log(distance);

    // console.log(data);

    const userId = getUserId(store.getState());
    if (userId && distance % 200 === 0) {
        await updateLocation(
            userId,
            new GeoPoint(
                data.locations[0].coords.latitude,
                data.locations[0].coords.longitude,
            ),
        );
    }

    addLocationToPath({ data, error });
};

export const addLocationToPath = ({ data, error }: any) => {
    if (error) {
        console.log("Error in background location task: ", error);
        return;
    }

    // console.log(data);
    // console.log("tu");

    store.dispatch(
        addPoint({
            latitude: data.locations[0].coords.latitude,
            longitude: data.locations[0].coords.longitude,
        }),
    );
};
