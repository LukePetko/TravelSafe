import { Alert } from "react-native";

export const createTripAlertButton = (): void =>
    Alert.alert(
        "Cannot start two trips at the same time",
        "If you want to start new trip end the running one",
        [
            {
                text: "OK",
                style: "cancel",
            },
        ],
    );

export const endTripAlertButton = (onPress: () => void): void =>
    Alert.alert("Do you want to stop the trip?", "", [
        {
            text: "Yes",
            onPress,
        },
        {
            text: "No",
            style: "cancel",
        },
    ]);

export const createPostAlertButton = (onPress: () => void): void =>
    Alert.alert(
        "Do you want to create post?",
        "Share your latest trip with your friends!",
        [
            {
                text: "Yes",
                onPress,
            },
            {
                text: "No",
                style: "cancel",
            },
        ],
    );

export const inactivityAlert = (onPress: () => void): void =>
    Alert.alert("You have been inactive for a while", "Is everything ok?", [
        {
            text: "Yes",
            onPress,
        },
    ]);
