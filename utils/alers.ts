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
