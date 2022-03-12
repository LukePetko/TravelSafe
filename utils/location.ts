import { GeoPoint } from "firebase/firestore";
import { updateLocation } from "../api/firestore";
import store from "../redux/store";
import { getUserId } from "../redux/stores/user";

export const saveLocationToFirestore = async ({ data, error }: any) => {
    if (error) {
        console.log("Error in background location task: ", error);
        return;
    }

    // console.log(data);

    const userId = getUserId(store.getState());
    if (userId) {
        await updateLocation(
            userId,
            new GeoPoint(
                data.locations[0].coords.latitude,
                data.locations[0].coords.longitude,
            ),
        );
    }
};

export const addLocationToPath = ({ data, error }: any) => {
    if (error) {
        console.log("Error in background location task: ", error);
        return;
    }

    // console.log(data);

    store.dispatch({
        type: "ADD_POINT",
        payload: {
            latitude: data.locations[0].coords.latitude,
            longitude: data.locations[0].coords.longitude,
        },
    });
};
