import { GeoPoint } from "firebase/firestore";
import { updateLocation } from "../api/firestore";
import store from "../redux/store";
import {
    addDistance,
    addLastMovementTime,
    addPoint,
    getDistance,
    getLastMovementTime,
    resetLastMovementTime,
} from "../redux/stores/trip";
import { getUserId } from "../redux/stores/user";
import { inactivityAlert } from "./alers";
import {
    inactiveLocalNotification,
    sendPushNotification,
} from "./notifications";
import {
    getCloseContacts,
    getUserById,
    createLocationNotification,
} from "../api/firestore";
import { CurrentTripInfo } from "./types/currentTripInfo";
import { User } from "./types/user";

export const saveLocationToFirestore = async ({ data, error }: any) => {
    if (error) {
        return;
    }

    store.dispatch(addDistance(10));
    store.dispatch(resetLastMovementTime());
    const distance = getDistance(store.getState());

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
        return;
    }

    store.dispatch(
        addPoint({
            latitude: data.locations[0].coords.latitude,
            longitude: data.locations[0].coords.longitude,
        }),
    );
};

export const checkTimer = async () => {
    const time = getLastMovementTime(store.getState());

    if (time === 60 * 60) {
        inactiveLocalNotification();
        inactivityAlert(() => store.dispatch(resetLastMovementTime()));
    }

    if (time === 80 * 60) {
        (async () => {
            const ids: string[] = [];
            const contacts: CurrentTripInfo[] | undefined =
                await getCloseContacts();
            if (contacts) {
                contacts.forEach((contact: CurrentTripInfo) => {
                    contact.expoNotificationIds.forEach((id: string) => {
                        ids.push(id);
                    });
                });
            }

            const user = (await getUserById(
                getUserId(store.getState()),
            )) as User;

            sendPushNotification(
                ids,
                `${user.username} was inactive for over an hour!`,
                "Go and check his location!",
            );

            createLocationNotification(
                getUserId(store.getState()),
                contacts?.map((c) => c.id) ?? [],
            );
        })();
    }

    store.dispatch(addLastMovementTime(1));
};
