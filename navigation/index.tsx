import { FontAwesome, Feather } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
    NavigationContainer,
    DefaultTheme,
    DarkTheme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import { ColorSchemeName } from "react-native";

import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import { useStoreSelector } from "../hooks/useStoreSelector";
import NotificationScreen from "../screens/NotificationScreen";
import NotFoundScreen from "../screens/NotFoundScreen";
import {
    HomeStackParamList,
    LoginStackParamList,
    PostStackParamList,
    ProfileStackParamList,
    RootStackParamList,
    RootTabParamList,
    RootTabScreenProps,
    SearchStackParamList,
    TripStackParamList,
} from "../types";
import LinkingConfiguration from "./LinkingConfiguration";
import { Login } from "../screens/auth/Login";
import MapScreen from "../screens/map/MapScreen";
import Register from "../screens/auth/Register";
import ProfileScreen from "../screens/profile/ProfileScreen";
import CameraModal from "../screens/profile/CameraModal";
import { Text, Pressable } from "../components/Themed";
import SettingsModal from "../screens/profile/SettingsModal";
import TripScreen from "../screens/trip/TripScreen";
import SearchScreen from "../screens/search/SearchScreen";
import SearchModal from "../screens/profile/SearchModal";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { Dispatch } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { getData } from "../async-storage";
import { login, setNotificationId, setUser } from "../redux/stores/user";
import { onSnapshot } from "firebase/firestore";
import { getUserDocById } from "../api/firestore";
import { Subscription } from "expo-modules-core";
import NewTripScreen from "../screens/trip/NewTripScreen";
import PlannedTripsScreen from "../screens/trip/PlannedTripsScreen";
import PastTripsScreen from "../screens/trip/PastTripsScreen";
import NewHolidayScreen from "../screens/trip/NewHolidayScreen";
import EditTripScreen from "../screens/trip/EditTripScreen";
import NewPostScreen from "../screens/posts/NewPost";
import HomeScreen from "../screens/home/HomeScreen";
import PastTripDetail from "../screens/trip/PastTripDetail";
import { registerForPushNotificationsAsync } from "../utils/notifications";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { addNotificationId } from "../api/firestore/accounts";

type UserState = {
    userId: string;
};

export type ColorSchemeEnum = "light" | "dark";

export type ColorType = {
    color: string;
};

const Navigation = ({
    colorScheme,
}: {
    colorScheme: ColorSchemeName;
}): JSX.Element => {
    const dispatch: Dispatch<any> = useDispatch<any>();

    const [expoPushToken, setExpoPushToken] = useState<string>("");
    const [notification, setNotification] = useState(false);
    const notificationListener: MutableRefObject<Subscription> = useRef();
    const responseListener: MutableRefObject<Subscription> = useRef();

    useEffect(() => {
        (async () => {
            const userId = await getData("userId");

            if (userId) {
                dispatch(login(userId));

                onSnapshot(getUserDocById(userId), (doc) => {
                    if (doc.exists()) {
                        dispatch(setUser(doc.data()));
                    }
                });

                if (Device.isDevice) {
                    registerForPushNotificationsAsync().then((token) => {
                        setExpoPushToken(token);
                        dispatch(setNotificationId(token));
                        console.error(token);
                        addNotificationId(userId, token);
                    });

                    notificationListener.current =
                        Notifications.addNotificationReceivedListener(
                            (notification) => {
                                // setNotification(notification as Boolean);
                                console.log("notification", notification);
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
            linking={LinkingConfiguration}
            theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
            {userId ? <RootNavigator /> : <AuthNavigator />}
        </NavigationContainer>
    );
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = (): JSX.Element => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Root"
                component={BottomTabNavigator}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="NotFound"
                component={NotFoundScreen}
                options={{ title: "Oops!" }}
            />
            <Stack.Group screenOptions={{ presentation: "modal" }}>
                <Stack.Screen
                    name="Notifications"
                    component={NotificationScreen}
                />
            </Stack.Group>
            <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        </Stack.Navigator>
    );
};

const LoginStack = createNativeStackNavigator<LoginStackParamList>();

const AuthNavigator = (): JSX.Element => {
    const colorScheme: ColorSchemeEnum = useColorScheme();

    return (
        <LoginStack.Navigator
            initialRouteName="Login"
            screenOptions={{
                gestureEnabled: true,
                headerTintColor: Colors[colorScheme].tint,
            }}
        >
            <LoginStack.Screen
                name="Login"
                component={Login}
                options={{ headerShown: false }}
            />
            <LoginStack.Screen
                name="Register"
                component={Register}
                // options={{ title: "Oops!" }}
            />
        </LoginStack.Navigator>
    );
};

const HomeStack = createNativeStackNavigator<HomeStackParamList>();

export const HomeStackNavigator = (): JSX.Element => {
    return (
        <HomeStack.Navigator>
            <HomeStack.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    headerShown: false,
                }}
            />
        </HomeStack.Navigator>
    );
};

const SearchStack = createNativeStackNavigator<SearchStackParamList>();

export const SearchStackNavigator = (): JSX.Element => {
    return (
        <SearchStack.Navigator>
            <SearchStack.Screen
                name="Search"
                component={SearchScreen}
                options={{
                    headerShown: true,
                }}
            />
        </SearchStack.Navigator>
    );
};

const PostStack = createNativeStackNavigator<PostStackParamList>();

export const PostStackNavigator = (): JSX.Element => {
    return (
        <PostStack.Navigator>
            <PostStack.Screen name="NewPost" component={NewPostScreen} />
        </PostStack.Navigator>
    );
};

const TripStack = createNativeStackNavigator<TripStackParamList>();

export const TripStackNavigator = (): JSX.Element => {
    return (
        <TripStack.Navigator>
            <TripStack.Screen name="Trips" component={TripScreen} />
            <TripStack.Screen
                name="NewTrip"
                component={NewTripScreen}
                options={{
                    headerShown: true,
                    title: "New Trip",
                }}
            />
            <TripStack.Screen
                name="NewHoliday"
                component={NewHolidayScreen}
                options={{
                    headerShown: true,
                    title: "New Holiday",
                }}
            />
            <TripStack.Screen
                name="PlannedTrips"
                component={PlannedTripsScreen}
                options={{
                    headerShown: true,
                    title: "Planned Trips",
                }}
            />
            <TripStack.Screen
                name="PastTrips"
                component={PastTripsScreen}
                options={{
                    headerShown: true,
                    title: "Past Trips",
                }}
            />
            <TripStack.Screen
                name="EditTrip"
                component={EditTripScreen}
                options={{
                    headerShown: true,
                    title: "Edit Trip",
                }}
            />
            <TripStack.Screen
                name="PastTripDetail"
                component={PastTripDetail}
                options={{
                    headerShown: true,
                }}
            />
        </TripStack.Navigator>
    );
};

const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();

export const ProfileStackNavigator = (): JSX.Element => {
    const colorScheme: ColorSchemeEnum = useColorScheme();

    return (
        <ProfileStack.Navigator
            initialRouteName="Profile"
            screenOptions={{
                gestureEnabled: true,
                // headerTintColor: Colors[colorScheme].tint,
            }}
        >
            <ProfileStack.Screen
                name="Profile"
                component={ProfileScreen}
                options={({ navigation }) => ({
                    // headerTitle: "Profile",
                    headerRight: () => (
                        <Pressable
                            onPress={() => {
                                navigation.navigate("SettingsModal");
                            }}
                        >
                            <Feather
                                name="settings"
                                size={24}
                                color={Colors[colorScheme].tint}
                            />
                        </Pressable>
                    ),
                })}
            />
            <ProfileStack.Screen
                name="CameraModal"
                component={CameraModal}
                options={({ navigation }) => ({
                    title: "",
                    presentation: "fullScreenModal",
                    headerRight: () => (
                        <Pressable onPress={() => navigation.goBack()}>
                            <Text
                                style={{
                                    color: Colors[colorScheme].tint,
                                    fontSize: 17,
                                }}
                            >
                                Done
                            </Text>
                        </Pressable>
                    ),
                })}
            />
            <ProfileStack.Screen
                name="SettingsModal"
                component={SettingsModal}
                options={({ navigation }) => ({
                    title: "Settings",
                    presentation: "modal",
                    headerRight: () => (
                        <Pressable onPress={() => navigation.goBack()}>
                            <Text
                                style={{
                                    color: Colors[colorScheme].tint,
                                    fontSize: 17,
                                }}
                            >
                                Done
                            </Text>
                        </Pressable>
                    ),
                })}
            />
            <ProfileStack.Screen
                name="SearchModal"
                component={SearchModal}
                options={({ navigation }) => ({
                    title: "Add Close Contact",
                    presentation: "modal",
                    headerRight: () => (
                        <Pressable onPress={() => navigation.goBack()}>
                            <Text
                                style={{
                                    color: Colors[colorScheme].tint,
                                    fontSize: 17,
                                }}
                            >
                                Cancel
                            </Text>
                        </Pressable>
                    ),
                })}
            />
            <ProfileStack.Screen name="NewPost" component={NewPostScreen} />
        </ProfileStack.Navigator>
    );
};

export default Navigation;
