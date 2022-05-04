import { View, Text, Button, useColorScheme } from "react-native";
import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, ScrollView } from "../../components/Themed";
import ListInput from "../../components/ListInput";
import ListLabel from "../../components/ListLabel";
import {
    deleteTrip,
    getUserHoliday,
    setTripActive,
    startTrip,
    updateTrip,
} from "../../api/firestore/trips";
import { getUserId } from "../../redux/stores/user";
import store from "../../redux/store";
import { Holiday } from "../../utils/types/holiday";
import ListCalendar from "../../components/ListCalendar";
import ProfilePicture from "../../components/ProfilePicture";
import { Trip as DefaultTrip } from "../../utils/types/trip";
import { tintColorLight } from "../../constants/Colors";
import { getTripId, start } from "../../redux/stores/trip";
import * as Location from "expo-location";
import { GeoPoint, Timestamp } from "@firebase/firestore";
import { createTripAlertButton } from "../../utils/alers";
import { Dispatch } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { startLocationTracking } from "../../api/backgroundLocation";
import { openImageDialog } from "../../utils/imagePicker";
import {
    removeThumbnail,
    uploadPostImage,
    uploadProfileImage,
    uploadThumbnail,
} from "../../api/storage";
import { v4 } from "uuid";

type EditTripScreenProps = {
    navigation: any;
    route: any;
};

type Trip = DefaultTrip & {
    holiday?: Holiday;
};

const PlannedTripDetailScreen = (props: EditTripScreenProps) => {
    const { navigation, route } = props;

    const [trip, setTrip] = useState<Trip>();

    const [oldImage, setOldImage] = useState<string>("");
    const [holidays, setHolidays] = useState<Holiday[]>([]);
    const [showHoliday, setShowHoliday] = useState(false);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const colorScheme = useColorScheme();

    const dispatch: Dispatch<any> = useDispatch<any>();

    const onChange = (
        key: keyof Trip,
        value: string | Timestamp | Holiday | null,
    ): void => {
        setTrip({
            ...trip!,
            [key]: value,
        });
    };

    const onSave = async () => {
        const newTrip: DefaultTrip = {
            ...trip!,
            holidayId: trip!.holiday?.holidayId || null,
        };

        await updateTrip(newTrip);
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
            await startTrip(userId, geoPoint, tripName, tripId);
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
        const trip: Trip = route.params.trip;
        getUserHoliday(userId).then((holidays) => {
            setHolidays(holidays);

            trip.holiday = holidays.find(
                (holiday) => holiday.holidayId === trip?.holidayId,
            );
        });

        setTrip(trip);
        setOldImage(trip.thumbnail!);
    }, []);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Button
                    title="Save"
                    color={tintColorLight}
                    onPress={() => onSave()}
                />
            ),
            headerTintColor: tintColorLight,
            headerTitleStyle: {
                color: colorScheme === "dark" ? "#fff" : "#000",
            },
        });
    }, [trip]);

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
                            onChange("startTime", Timestamp.fromDate(date));
                        }}
                        setTime={(time: Date): void => {
                            onChange("startTime", Timestamp.fromDate(time));
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
                            onChange("endTime", Timestamp.fromDate(date));
                        }}
                        setTime={(time: Date): void => {
                            onChange("endTime", Timestamp.fromDate(time));
                        }}
                        date={trip?.endTime!.toDate()}
                        time={trip?.endTime!.toDate()}
                        minimumDate={trip?.startTime.toDate()}
                    >
                        End Time
                    </ListCalendar>
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
                        isLoading={isUploading}
                        onPress={() =>
                            openImageDialog(
                                navigation,
                                async (blob) => {
                                    setIsUploading(true);
                                    const url = await uploadThumbnail(
                                        blob,
                                        v4(),
                                        userId,
                                    );
                                    onChange("thumbnail", url);
                                    setIsUploading(false);
                                },
                                colorScheme as "light" | "dark" | undefined,
                            )
                        }
                    />
                    <ListLabel
                        borderRadius={{ top: true, bottom: true }}
                        style={{ marginTop: 20 }}
                        textStyles={{ color: tintColorLight }}
                        onPress={() => onStart()}
                    >
                        Start Trip
                    </ListLabel>

                    <ListLabel
                        borderRadius={{ top: true, bottom: true }}
                        style={{ marginVertical: 20 }}
                        textStyles={{ color: "red" }}
                        onPress={() => {
                            trip!.id ? deleteTrip(userId, trip!.id) : null;
                            navigation.navigate("Trips");
                        }}
                    >
                        Delete Trip
                    </ListLabel>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default PlannedTripDetailScreen;
