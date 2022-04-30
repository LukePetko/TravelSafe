import { View, Text, Button, useColorScheme } from "react-native";
import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, ScrollView } from "../../components/Themed";
import ListInput from "../../components/ListInput";
import ListLabel from "../../components/ListLabel";
import {
    getCreatedUserHoliday,
    setTripActive,
    startTrip,
    updateTrip,
} from "../../api/firestore/trips";
import { getUser, getUserId } from "../../redux/stores/user";
import store from "../../redux/store";
import { Holiday } from "../../utils/types/holiday";
import { NewTripState } from "./NewTripScreen";
import ListCalendar from "../../components/ListCalendar";
import ProfilePicture from "../../components/ProfilePicture";
import { Trip } from "../../utils/types/trip";
import { tintColorLight } from "../../constants/Colors";
import { getTripId, start } from "../../redux/stores/trip";
import * as Location from "expo-location";
import { GeoPoint } from "@firebase/firestore";
import { createTripAlertButton } from "../../utils/alers";
import { Dispatch } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { startLocationTracking } from "../../api/backgroundLocation";

type EditTripScreenProps = {
    navigation: any;
    route: any;
};

const EditTripScreen = (props: EditTripScreenProps) => {
    const { navigation, route } = props;

    const [tripState, setTripState] = useState<NewTripState>({
        name: "",
        description: "",
        holiday: null,
        startTime: new Date(),
        endTime: new Date(),
        thumbnail:
            "https://images.unsplash.com/photo-1642543492493-f57f7047be73?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    });
    const [trip, setTrip] = useState<Trip>();

    const [holidays, setHolidays] = useState<Holiday[]>([]);
    const [showHoliday, setShowHoliday] = useState(false);
    const colorScheme = useColorScheme();

    const dispatch: Dispatch<any> = useDispatch<any>();

    navigation.setOptions({
        headerRight: () => (
            <Button
                title="Save"
                color={tintColorLight}
                onPress={() => onSave()}
            />
        ),
        headerTintColor: tintColorLight,
        headerTitleStyle: { color: colorScheme === "dark" ? "#fff" : "#000" },
    });

    const onChange = (
        key: keyof Trip,
        value: string | Date | Holiday | null,
    ): void => {
        setTrip({
            ...trip,
            [key]: value,
        });
    };

    const onSave = async () => {
        console.log("saving trip");
        await updateTrip(trip!);
        navigation.goBack();
    };

    const onStart = async () => {
        if (!getTripId(store.getState())) {
            const tripId: string = route.params.trip.id;
            const tripName: string = route.params.trip.name;
            const location: Location.LocationObject =
                await Location.getCurrentPositionAsync();
            const geoPoint: GeoPoint = new GeoPoint(
                location.coords.latitude,
                location.coords.longitude,
            );
            console.log(await startTrip(userId, geoPoint, tripName, tripId));
            dispatch(start(tripId));
            startLocationTracking(userId);
            setTripActive(getUserId(store.getState()), tripId);
            navigation.navigate("MapTab");
            return;
        }
        createTripAlertButton();
    };

    const userId = getUserId(store.getState());

    useEffect(() => {
        getCreatedUserHoliday(userId).then((holidays) => {
            setHolidays(holidays);
        });

        const trip: Trip = route.params.trip;
        setTrip(trip);
    }, []);

    return (
        <KeyboardAvoidingView
            behavior={"padding"}
            style={{
                flex: 1,
                height: "100%",
            }}
            enabled
            keyboardVerticalOffset={90}
        >
            <ScrollView>
                <Text
                    style={{
                        fontWeight: "bold",
                        fontSize: 32,
                        padding: 10,
                    }}
                >
                    New Trip
                </Text>
                <View style={{ alignItems: "center", marginTop: 20 }}>
                    <ListInput
                        value={trip?.name}
                        onChangeText={(value: string): void => {
                            onChange("name", value);
                        }}
                        placeholder={"Enter trip name"}
                        separator={holidays.length > 0}
                        borderRadius={{
                            top: true,
                            bottom: holidays.length === 0,
                        }}
                    />
                    {holidays.length > 0 && (
                        <ListLabel
                            showChevron={true}
                            borderRadius={{ bottom: !showHoliday }}
                            separator={showHoliday}
                            rotateChevron={showHoliday}
                            onPress={() => setShowHoliday(!showHoliday)}
                            fieldValue={trip?.holiday?.name}
                        >
                            Holiday
                        </ListLabel>
                    )}

                    {showHoliday && (
                        <>
                            <ListLabel
                                separator={true}
                                onPress={() => {
                                    onChange("holiday", null);
                                    setShowHoliday(false);
                                }}
                            >
                                No Holiday
                            </ListLabel>

                            {holidays.map((holiday, index) => (
                                <ListLabel
                                    key={holiday.id}
                                    borderRadius={{
                                        bottom: index === holidays.length - 1,
                                    }}
                                    separator={index !== holidays.length - 1}
                                    onPress={() => {
                                        onChange("holiday", holiday);
                                        setShowHoliday(false);
                                    }}
                                >
                                    {holiday.name}
                                </ListLabel>
                            ))}
                        </>
                    )}

                    <ListCalendar
                        style={{ marginTop: 20 }}
                        borderRadius={{ top: true }}
                        separator={true}
                        showDatePicker={true}
                        showTimePicker={true}
                        setDate={(date: Date): void => {
                            onChange("startTime", date);
                        }}
                        setTime={(time: Date): void => {
                            onChange("startTime", time);
                        }}
                        date={trip?.startTime.toDate()}
                        time={trip?.startTime.toDate()}
                        minimumDate={new Date()}
                    >
                        Start Time
                    </ListCalendar>
                    <ListCalendar
                        borderRadius={{ bottom: true }}
                        showDatePicker={true}
                        showTimePicker={true}
                        setDate={(date: Date): void => {
                            onChange("endTime", date);
                        }}
                        setTime={(time: Date): void => {
                            onChange("endTime", time);
                        }}
                        date={trip?.endTime.toDate()}
                        time={trip?.endTime.toDate()}
                        minimumDate={trip?.startTime.toDate()}
                    >
                        End Time
                    </ListCalendar>

                    <ListLabel
                        showChevron={true}
                        borderRadius={{ top: true }}
                        separator={true}
                        style={{ marginTop: 20 }}
                    >
                        Start Place
                    </ListLabel>
                    <ListLabel
                        showChevron={true}
                        borderRadius={{ bottom: true }}
                    >
                        End Place
                    </ListLabel>

                    <ListInput
                        value={trip?.description}
                        onChangeText={(value: string): void => {
                            onChange("description", value);
                        }}
                        placeholder={"Enter Description"}
                        borderRadius={{ top: true, bottom: true }}
                        style={{ marginTop: 20 }}
                    />
                    <Text
                        style={{
                            fontWeight: "bold",
                            fontSize: 32,
                            padding: 10,
                        }}
                    >
                        Thumbnail
                    </Text>
                    <ProfilePicture
                        photoURL={trip?.thumbnail!}
                        onPress={() => {}}
                    />
                    <ListLabel
                        borderRadius={{ top: true, bottom: true }}
                        style={{ marginVertical: 20 }}
                        textStyles={{ color: tintColorLight }}
                        onPress={() => onStart()}
                    >
                        Start Trip
                    </ListLabel>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default EditTripScreen;
