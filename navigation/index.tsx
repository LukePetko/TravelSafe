import {
    NavigationContainer,
    DefaultTheme,
    DarkTheme,
} from "@react-navigation/native";
import * as React from "react";
import { ColorSchemeName } from "react-native";

import { useStoreSelector } from "../hooks/useStoreSelector";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { Dispatch } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { getData } from "../async-storage";
import { login, setNotificationId, setUser } from "../redux/stores/user";
import { onSnapshot } from "firebase/firestore";
import { getUserDocById, addNotificationId } from "../api/firestore";
import { Subscription } from "expo-modules-core";
import { registerForPushNotificationsAsync } from "../utils/notifications";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { RootNavigator } from "./navigators/RootNavigator";
import { AuthNavigator } from "./navigators/AuthStack";

type UserState = {
    userId: string;
};

const Navigation = ({
    colorScheme,
}: {
    colorScheme: ColorSchemeName;
}): JSX.Element => {
    const dispatch: Dispatch<any> = useDispatch<any>();

    const [notification, setNotification] = useState<any>(false);
    const notificationListener: MutableRefObject<Subscription> = useRef();
    const responseListener: MutableRefObject<Subscription> = useRef();

    useEffect(() => {
        (async () => {
            const userId = (await getData("userId")) as string;

            if (userId) {
                dispatch(login(userId));

                onSnapshot(getUserDocById(userId), (doc) => {
                    if (doc.exists()) {
                        dispatch(setUser(doc.data()));
                    }
                });

                if (Device.isDevice) {
                    registerForPushNotificationsAsync().then((token) => {
                        dispatch(setNotificationId(token));
                        addNotificationId(userId, token);
                    });

                    notificationListener.current =
                        Notifications.addNotificationReceivedListener(
                            (notification) => {
                                setNotification(notification);
                            },
                        );

                    responseListener.current =
                        Notifications.addNotificationResponseReceivedListener(
                            (response) => {
                                console.log(response);
                            },
                        );

                    return () => {
                        Notifications.removeNotificationSubscription(
                            notificationListener.current,
                        );
                        Notifications.removeNotificationSubscription(
                            responseListener.current,
                        );
                    };
                }
            }
        })();
    }, []);

    const { userId }: UserState = useStoreSelector((state) => state.user);
    return (
        <NavigationContainer
            theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
            {userId ? <RootNavigator /> : <AuthNavigator />}
        </NavigationContainer>
    );
};

export default Navigation;
