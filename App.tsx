import { StatusBar } from "expo-status-bar";
import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";

import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";
import store from "./redux/store";

import "./utils/location";
import {
    registerForPushNotificationsAsync,
    sendPushNotification,
} from "./utils/notifications";
import * as Notifications from "expo-notifications";
import { Subscription } from "expo-modules-core";
import { Button } from "react-native";

const App = (): JSX.Element | null => {
    const [expoPushToken, setExpoPushToken] = useState<string>("");
    const [notification, setNotification] = useState(false);
    const notificationListener: MutableRefObject<Subscription> = useRef();
    const responseListener: MutableRefObject<Subscription> = useRef();

    const isLoadingComplete = useCachedResources();
    const colorScheme = useColorScheme();

    useEffect(() => {
        registerForPushNotificationsAsync().then((token) =>
            setExpoPushToken(token),
        );

        notificationListener.current =
            Notifications.addNotificationReceivedListener((notification) => {
                // setNotification(notification as Boolean);
                console.log("notification", notification);
            });

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
    }, []);

    if (!isLoadingComplete) {
        return null;
    } else {
        return (
            // <GestureHandlerRootView>
            <Provider store={store}>
                <SafeAreaProvider>
                    <Navigation colorScheme={colorScheme} />
                    <StatusBar />
                </SafeAreaProvider>
            </Provider>
            // </GestureHandlerRootView>
        );
    }
};

export default App;
