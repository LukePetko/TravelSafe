/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
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
import ModalScreen from "../screens/ModalScreen";
import NotFoundScreen from "../screens/NotFoundScreen";
import TabOneScreen from "../screens/TabOneScreen";
import TabTwoScreen from "../screens/TabTwoScreen";
import {
    LoginStackParamList,
    ProfileStackParamList,
    RootStackParamList,
    RootTabParamList,
    RootTabScreenProps,
} from "../types";
import LinkingConfiguration from "./LinkingConfiguration";
import { Login } from "../screens/auth/Login";
import MapScreen from "../screens/MapScreen";
import Register from "../screens/auth/Register";
import ProfileScreen from "../screens/ProfileScreen";
import CameraModal from "../screens/CameraModal";
import { Text, Pressable } from "../components/Themed";
import SettingsModal from "../screens/SettingsModal";

type UserState = {
    user: string;
};

type ColorSchemeEnum = "light" | "dark";

type ColorType = {
    color: string;
};

const Navigation = ({
    colorScheme,
}: {
    colorScheme: ColorSchemeName;
}): JSX.Element => {
    const { user }: UserState = useStoreSelector((state) => state.user);
    return (
        <NavigationContainer
            linking={LinkingConfiguration}
            theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
            {user ? <RootNavigator /> : <AuthNavigator />}
        </NavigationContainer>
    );
};

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
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
                <Stack.Screen name="Modal" component={ModalScreen} />
            </Stack.Group>
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

const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();

export const ProfileStackNavigator = (): JSX.Element => {
    const colorScheme: ColorSchemeEnum = useColorScheme();

    return (
        <ProfileStack.Navigator
            initialRouteName="Profile"
            screenOptions={{
                gestureEnabled: true,
                headerTintColor: Colors[colorScheme].tint,
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
        </ProfileStack.Navigator>
    );
};

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>();

export const BottomTabNavigator = (): JSX.Element => {
    const colorScheme: ColorSchemeEnum = useColorScheme();

    return (
        <BottomTab.Navigator
            initialRouteName="HomeTab"
            screenOptions={{
                tabBarActiveTintColor: Colors[colorScheme].tint,
            }}
        >
            <BottomTab.Screen
                name="HomeTab"
                component={TabOneScreen}
                options={({ navigation }: RootTabScreenProps<"HomeTab">) => ({
                    title: "Home",
                    tabBarIcon: ({ color }: ColorType) => (
                        <Feather name="home" size={24} color={color} />
                    ),
                    headerRight: () => (
                        <Pressable
                            onPress={() => navigation.navigate("Modal")}
                            style={({ pressed }: { pressed: boolean }) => ({
                                opacity: pressed ? 0.5 : 1,
                            })}
                        >
                            <FontAwesome
                                name="info-circle"
                                size={25}
                                color={Colors[colorScheme].text}
                                style={{ marginRight: 15 }}
                            />
                        </Pressable>
                    ),
                })}
            />
            <BottomTab.Screen
                name="SearchTab"
                component={TabTwoScreen}
                options={{
                    title: "Search",
                    tabBarIcon: ({ color }: ColorType) => (
                        <Feather name="search" size={24} color={color} />
                    ),
                }}
            />
            <BottomTab.Screen
                name="TripTab"
                component={TabTwoScreen}
                options={{
                    title: "Trip",
                    tabBarIcon: ({ color }: ColorType) => (
                        <Feather name="plus" size={24} color={color} />
                    ),
                }}
            />
            <BottomTab.Screen
                name="MapTab"
                component={MapScreen}
                options={{
                    title: "Map",
                    tabBarIcon: ({ color }: ColorType) => (
                        <Feather name="map" size={24} color={color} />
                    ),
                    headerShown: false,
                }}
            />
            <BottomTab.Screen
                name="ProfileTab"
                component={ProfileStackNavigator}
                options={{
                    title: "Profile",
                    tabBarIcon: ({ color }: ColorType) => (
                        <Feather name="user" size={24} color={color} />
                    ),
                    headerShown: false,
                }}
            />
        </BottomTab.Navigator>
    );
};

export default Navigation;
