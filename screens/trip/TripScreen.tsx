import { View } from "react-native";
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

const TripScreen = (): JSX.Element => {
    const [userId, setUserId] = useState<string>("");
    const [tripId, setTripId] = useState<string>("");

    const dispatch: Dispatch<any> = useDispatch<any>();

    const createQuckTrip = async () => {
        if (!tripId) {
            const location = await Location.getCurrentPositionAsync({});
            const trip: Trip = {
                userId,
                name: "Quick Trip",
                startTime: new Date(),
                startPlace: new GeoPoint(
                    location.coords.latitude,
                    location.coords.longitude,
                ),

                notifyCloseContacts: false,

                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const tripId = await createTrip(trip);
            setTripId(tripId);
            dispatch(start(tripId));
            console.log("tripId", tripId);
        } else {
            setTripId("");
            dispatch(end());
            console.log("tripId", tripId);
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
        </View>
    );
};

export default TripScreen;
