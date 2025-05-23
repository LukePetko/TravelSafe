/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import {
    CompositeScreenProps,
    NavigatorScreenParams,
} from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList {}
    }
}

export type RootStackParamList = {
    Root: NavigatorScreenParams<RootTabParamList> | undefined;
    Notifications: undefined;
    NotFound: undefined;
    ProfileScreen: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
    NativeStackScreenProps<RootStackParamList, Screen>;

export type RootTabParamList = {
    HomeTab: undefined;
    SearchTab: undefined;
    TripTab: undefined;
    MapTab: undefined;
    ProfileTab: undefined;
};

export type LoginStackParamList = {
    Login: undefined;
    Register: undefined;
};

export type HomeStackParamList = {
    Home: undefined;
};

export type SearchStackParamList = {
    Search: undefined;
};

export type PostStackParamList = {
    NewPost: undefined;
};

export type TripStackParamList = {
    Trips: undefined;
    NewTrip: undefined;
    NewHoliday: undefined;
    PastTrips: undefined;
    PlannedTrips: undefined;
    PlannedTripDetail: undefined;
    PastTripDetail: undefined;
    Holiday: undefined;
    HolidayDetail: undefined;
};

export type ProfileStackParamList = {
    Profile: undefined;
    CameraModal: undefined;
    SettingsModal: undefined;
    SearchModal: undefined;
    NewPost: undefined;
};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> =
    CompositeScreenProps<
        BottomTabScreenProps<RootTabParamList, Screen>,
        NativeStackScreenProps<RootStackParamList>
    >;

export type ColorSchemeEnum = "light" | "dark";

export type ColorType = {
    color: string;
};
