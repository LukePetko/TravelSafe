import { GeoPoint, Timestamp } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { Button, useColorScheme } from "react-native";
import MapView, { LatLng, Marker, Polyline } from "react-native-maps";
import { v4 } from "uuid";
import {
    deleteHoliday,
    getHolidayTrips,
    updateHoliday,
} from "../../api/firestore";
import { uploadThumbnail } from "../../api/storage";
import ListCalendar from "../../components/ListCalendar";
import ListInput from "../../components/ListInput";
import ListLabel from "../../components/ListLabel";
import ProfilePicture from "../../components/ProfilePicture";
import {
    KeyboardAvoidingView,
    ScrollView,
    View,
    Text,
} from "../../components/Themed";
import { tintColorLight } from "../../constants/Colors";
import store from "../../redux/store";
import { getUser, getUserId } from "../../redux/stores/user";
import { openImageDialog } from "../../utils/imagePicker";
import { Holiday } from "../../utils/types/holiday";
import { Trip } from "../../utils/types/trip";

type HolidayDetailScreenProps = {
    navigation: any;
    route: any;
};

const HolidayDetailScreen = (props: HolidayDetailScreenProps) => {
    const { navigation, route } = props;

    const [holiday, setHoliday] = useState<Holiday>(route.params.holiday);
    const [trips, setTrips] = useState<Trip[]>([]);
    const [isUploading, setIsUploading] = useState<boolean>(false);

    const colorScheme = useColorScheme();

    const onChange = (
        key: keyof Holiday,
        value: string | Timestamp | null,
    ): void => {
        setHoliday({
            ...holiday,
            [key]: value,
        });
    };

    const onSave = async (): Promise<void> => {
        await updateHoliday(holiday);
        navigation.goBack();
    };

    const mapRef = useRef() as React.MutableRefObject<MapView>;

    useEffect(() => {
        getHolidayTrips(getUserId(store.getState()), holiday.holidayId!).then(
            (trips) => {
                setTrips(
                    trips.map((trip) => ({
                        ...trip,
                        path: trip.path ? JSON.parse(trip.path as string) : [],
                    })),
                );
            },
        );
    }, []);

    useEffect(() => {
        navigation.setOptions({
            title: holiday.name,
            headerTintColor: tintColorLight,
            headerTitleStyle: {
                color: colorScheme === "dark" ? "#fff" : "#000",
            },
            headerRight: () => (
                <Button
                    title="Save"
                    color={tintColorLight}
                    onPress={() => onSave()}
                />
            ),
        });
    }, [holiday]);

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
                    Holiday detail
                </Text>
                <View style={{ alignItems: "center", marginTop: 20 }}>
                    <ListInput
                        value={holiday?.name}
                        onChangeText={(value: string): void => {
                            onChange("name", value);
                        }}
                        placeholder={"Enter trip name"}
                        borderRadius={{
                            top: true,
                            bottom: true,
                        }}
                    />

                    {holiday?.startTime && (
                        <ListCalendar
                            style={{ marginTop: 20 }}
                            borderRadius={{ top: true }}
                            separator={true}
                            showDatePicker={true}
                            setDate={(date: Date): void => {
                                onChange("startTime", Timestamp.fromDate(date));
                            }}
                            date={holiday?.startTime.toDate()}
                            minimumDate={new Date()}
                        >
                            Start Time
                        </ListCalendar>
                    )}
                    {holiday?.endTime && (
                        <ListCalendar
                            borderRadius={{ bottom: true }}
                            showDatePicker={true}
                            setDate={(date: Date): void => {
                                onChange("endTime", Timestamp.fromDate(date));
                            }}
                            date={holiday?.endTime.toDate()}
                            minimumDate={holiday?.startTime.toDate()}
                        >
                            End Time
                        </ListCalendar>
                    )}
                    <ListInput
                        value={holiday?.description}
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
                            fontSize: 24,
                            padding: 10,
                        }}
                    >
                        Thumbnail
                    </Text>
                    <ProfilePicture
                        photoURL={holiday?.thumbnail!}
                        isLoading={isUploading}
                        onPress={() =>
                            openImageDialog(
                                navigation,
                                async (blob) => {
                                    setIsUploading(true);
                                    const url = await uploadThumbnail(
                                        blob,
                                        v4(),
                                        getUserId(store.getState()),
                                    );
                                    onChange("thumbnail", url);
                                    setIsUploading(false);
                                },
                                colorScheme as "light" | "dark" | undefined,
                            )
                        }
                    />
                    {trips.length > 0 && (
                        <Text
                            style={{
                                fontWeight: "bold",
                                fontSize: 32,
                                padding: 10,
                                marginTop: 20,
                                alignSelf: "flex-start",
                            }}
                        >
                            Holiday Trips
                        </Text>
                    )}

                    {trips.map((trip, index) => (
                        <ListLabel
                            key={trip.id}
                            showChevron={true}
                            borderRadius={{
                                top: index === 0,
                                bottom: index === trips.length - 1,
                            }}
                            separator={index !== trips.length - 1}
                            onPress={() => {
                                navigation.navigate(
                                    trip.status === "ended"
                                        ? "PastTripDetail"
                                        : "PlannedTripDetail",
                                    {
                                        trip: {
                                            ...trip,
                                            path: JSON.stringify(
                                                trip.path as GeoPoint[],
                                            ),
                                        },
                                    },
                                );
                            }}
                        >
                            {trip.name}
                        </ListLabel>
                    ))}

                    <MapView
                        style={{
                            height: 200,
                            width: "100%",
                            marginTop: 20,
                        }}
                        ref={mapRef}
                        onLayout={() => {
                            mapRef.current.fitToCoordinates(
                                trips
                                    .map((trip) => trip.path)
                                    .flat()
                                    .map(
                                        (
                                            coords:
                                                | GeoPoint
                                                | string
                                                | undefined,
                                        ) =>
                                            ({
                                                latitude:
                                                    typeof coords !== "string"
                                                        ? coords!.latitude
                                                        : 0,
                                                longitude:
                                                    typeof coords !== "string"
                                                        ? coords!.longitude
                                                        : 0,
                                            } as LatLng),
                                    ),

                                {
                                    edgePadding: {
                                        top: 50,
                                        right: 50,
                                        bottom: 50,
                                        left: 50,
                                    },
                                    animated: true,
                                },
                            );
                        }}
                    >
                        {trips.map((trip) => (
                            <View key={trip.id}>
                                {trip.path!.length > 0 && (
                                    <>
                                        <Marker
                                            coordinate={{
                                                latitude: (
                                                    trip.path![0] as GeoPoint
                                                ).latitude,
                                                longitude: (
                                                    trip.path![0] as GeoPoint
                                                ).longitude,
                                            }}
                                            title={`${trip.name} Start`}
                                            pinColor={"lime"}
                                        />
                                        <Marker
                                            coordinate={{
                                                latitude: (
                                                    trip.path![
                                                        trip.path!.length - 1
                                                    ] as GeoPoint
                                                ).latitude,
                                                longitude: (
                                                    trip.path![
                                                        trip.path!.length - 1
                                                    ] as GeoPoint
                                                ).longitude,
                                            }}
                                            title={`${trip.name} End`}
                                            pinColor={"red"}
                                        />
                                        <Polyline
                                            coordinates={
                                                trip.path as GeoPoint[]
                                            }
                                            strokeWidth={3}
                                            strokeColor={tintColorLight}
                                        />
                                    </>
                                )}
                            </View>
                        ))}
                    </MapView>
                    <ListLabel
                        borderRadius={{ top: true, bottom: true }}
                        style={{ marginVertical: 20 }}
                        textStyles={{ color: "red" }}
                        onPress={() => {
                            holiday!.holidayId
                                ? deleteHoliday(
                                      getUserId(store.getState()),
                                      holiday!.holidayId,
                                  )
                                : null;
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

export default HolidayDetailScreen;
