import { GeoPoint, getDocs } from "firebase/firestore";
import { Alert } from "react-native";
import { getCloseContactsQuery, updateLocation } from "../api/firestore";
import store from "../redux/store";
import {
    addDistance,
    addLastMovementTime,
    addPoint,
    getDistance,
    getLastMovementTime,
    resetLastMovementTime,
} from "../redux/stores/trip";
import { getUser, getUserId } from "../redux/stores/user";
import { inactivityAlert } from "./alers";
import * as Notifications from "expo-notifications";
import { Notification } from "expo-notifications";
import {
    inactiveLocalNotification,
    sendPushNotification,
} from "./notifications";
import { CloseContact, PublicUser } from "./types/user";
import { getCloseContacts } from "../api/firestore/accounts";
import { CurrentTripInfo } from "./types/currentTripInfo";
import { createLocationNotification } from "../api/firestore/notifications";

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

    if (time === 5) {
        inactiveLocalNotification();
        inactivityAlert(() => store.dispatch(resetLastMovementTime()));
    }

    if (time === 10) {
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
            sendPushNotification(
                ids,
                `${
                    getUser(store.getState()).username
                } was inactive for over an hour!`,
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
