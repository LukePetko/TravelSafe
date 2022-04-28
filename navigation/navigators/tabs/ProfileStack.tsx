import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { useColorScheme } from "react-native";
import { Pressable, Text } from "../../../components/Themed";
import CameraModal from "../../../screens/profile/CameraModal";
import ProfileScreen from "../../../screens/profile/ProfileScreen";
import SearchModal from "../../../screens/profile/SearchModal";
import SettingsModal from "../../../screens/profile/SettingsModal";
import { ColorSchemeEnum, ProfileStackParamList } from "../../../types";
import NewPostScreen from "../../../screens/posts/NewPost";
import { Feather } from "@expo/vector-icons";
import Colors from "../../../constants/Colors";

const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();

export const ProfileStackNavigator = (): JSX.Element => {
    const colorScheme: ColorSchemeEnum = useColorScheme() as ColorSchemeEnum;

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
