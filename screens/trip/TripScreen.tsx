import React, { useEffect, useState } from "react";
import ListLabel from "../../components/ListLabel";
import { getUserId } from "../../redux/stores/user";
import store from "../../redux/store";
import { Dispatch } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { end, getTripId, resetDistance, start } from "../../redux/stores/trip";
import { endTrip, startNewQuickTrip } from "../../utils/trip";
import {
    startLocationTracking,
    stopLocationTracking,
} from "../../api/backgroundLocation";
import { createTripAlertButton } from "../../utils/alers";
import { ScrollView, View } from "../../components/Themed";

type TripScreenProps = {
    navigation: any;
};

const TripScreen = (props: TripScreenProps): JSX.Element => {
    const { navigation } = props;
    const [userId, setUserId] = useState<string>("");

    const dispatch: Dispatch<any> = useDispatch<any>();

    const createQuckTrip = async () => {
        if (!getTripId(store.getState())) {
            const tripId = await startNewQuickTrip();
            dispatch(start(tripId));
            startLocationTracking(userId);
        } else {
            createTripAlertButton();
        }
    };

    useEffect(() => {
        setUserId(getUserId(store.getState()));
    }, []);

    return (
        <View
            style={{
                flex: 1,
            }}
        >
            <ScrollView
                style={{
                    alignItems: "center",
                    paddingTop: 30,
                }}
            >
                <ListLabel
                    borderRadius={{ top: true }}
                    separator={true}
                    onPress={() => createQuckTrip()}
                >
                    New Quick Trip
                </ListLabel>
                <ListLabel
                    separator={true}
                    onPress={() => navigation.navigate("NewTrip")}
                >
                    New Trip
                </ListLabel>
                <ListLabel
                    borderRadius={{ bottom: true }}
                    onPress={() => navigation.navigate("NewHoliday")}
                >
                    New Holiday
                </ListLabel>

                <ListLabel
                    borderRadius={{ top: true }}
                    style={{ marginTop: 20 }}
                    separator={true}
                    onPress={() => navigation.navigate("PlannedTrips")}
                >
                    Planned Trips
                </ListLabel>
                <ListLabel
                    borderRadius={{ bottom: true }}
                    onPress={() => navigation.navigate("PastTrips")}
                >
                    Past Trips
                </ListLabel>

                <ListLabel
                    borderRadius={{ top: true, bottom: true }}
                    style={{ marginTop: 20 }}
                    onPress={() => navigation.navigate("Holiday")}
                >
                    Holidays
                </ListLabel>

                <ListLabel
                    borderRadius={{ top: true, bottom: true }}
                    style={{ marginTop: 20 }}
                    onPress={async () => {
                        if (getTripId(store.getState())) {
                            stopLocationTracking();
                            endTrip();
                            dispatch(end());
                            dispatch(resetDistance());
                        }
                    }}
                >
                    End Trip
                </ListLabel>
            </ScrollView>
        </View>
    );
};

export default TripScreen;
