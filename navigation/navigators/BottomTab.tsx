import { Feather, FontAwesome } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { useColorScheme } from "react-native";
import { Pressable } from "../../components/Themed";
import Colors from "../../constants/Colors";
import MapScreen from "../../screens/map/MapScreen";
import {
    ColorSchemeEnum,
    ColorType,
    RootTabParamList,
    RootTabScreenProps,
} from "../../types";
import { HomeStackNavigator } from "./tabs/HomeStack";
import { ProfileStackNavigator } from "./tabs/ProfileStack";
import { SearchStackNavigator } from "./tabs/SearchStack";
import { TripStackNavigator } from "./tabs/TripStack";

const BottomTab = createBottomTabNavigator<RootTabParamList>();

export const BottomTabNavigator = (): JSX.Element => {
    const colorScheme: ColorSchemeEnum = useColorScheme() as ColorSchemeEnum;

    return (
        <BottomTab.Navigator
            initialRouteName="HomeTab"
            screenOptions={{
                tabBarActiveTintColor: Colors[colorScheme].tint,
            }}
        >
            <BottomTab.Screen
                name="HomeTab"
                component={HomeStackNavigator}
                options={({ navigation }: RootTabScreenProps<"HomeTab">) => ({
                    title: "Home",
                    tabBarIcon: ({ color }: ColorType) => (
                        <Feather name="home" size={24} color={color} />
                    ),
                    headerRight: () => (
                        <Pressable
                            onPress={() => navigation.navigate("Notifications")}
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
                component={SearchStackNavigator}
                options={{
                    title: "Search",
                    tabBarIcon: ({ color }: ColorType) => (
                        <Feather name="search" size={24} color={color} />
                    ),
                    headerShown: false,
                }}
            />
            <BottomTab.Screen
                name="TripTab"
                component={TripStackNavigator}
                options={{
                    title: "Trip",
                    tabBarIcon: ({ color }: ColorType) => (
                        <Feather name="plus" size={24} color={color} />
                    ),
                    headerShown: false,
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
