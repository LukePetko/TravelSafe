import { Alert, View } from "react-native";
import { Text } from "../../components/Themed";
import React, { useEffect, useState } from "react";
import ListInput from "../../components/ListInput";
import ListLabel from "../../components/ListLabel";
import { Trip } from "../../utils/types/trip";
import { GeoPoint } from "firebase/firestore";
import { createTrip } from "../../api/firestore";
import { getUserId } from "../../redux/stores/user";
import store from "../../redux/store";
import * as Location from "expo-location";
import { Dispatch } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { end, start } from "../../redux/stores/trip";
import { endTrip, startNewQuickTrip } from "../../utils/trip";

const TripScreen = (): JSX.Element => {
    const [userId, setUserId] = useState<string>("");
    const [tripId, setTripId] = useState<string>("");

    const dispatch: Dispatch<any> = useDispatch<any>();

    const createAlertButton = (): void =>
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

    const createQuckTrip = async () => {
        if (!tripId) {
            const tripId = await startNewQuickTrip();
            setTripId(tripId);
        } else {
            createAlertButton();
        }
    };

    useEffect(() => {
        setUserId(getUserId(store.getState()));
    }, []);

    return (
        <View
            style={{
                alignItems: "center",
                paddingTop: 30,
            }}
        >
            <ListLabel
                borderRadius={{ top: true, bottom: true }}
                onPress={() => createQuckTrip()}
            >
                New Quick Trip
            </ListLabel>
            <ListLabel
                borderRadius={{ top: true, bottom: true }}
                onPress={async () => {
                    setTripId((await endTrip()) ? "" : tripId);
                }}
            >
                End Trip
            </ListLabel>
        </View>
    );
};

export default TripScreen;
