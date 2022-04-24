import { GeoPoint } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import MapView, { Marker, Polyline } from "react-native-maps";
import { connect } from "react-redux";
import { getCreatedUserHoliday } from "../../api/firestore/trips";
import ListInput from "../../components/ListInput";
import ListLabel from "../../components/ListLabel";
import ProfilePicture from "../../components/ProfilePicture";
import {
    View,
    Text,
    KeyboardAvoidingView,
    ScrollView,
} from "../../components/Themed";
import { tintColorLight } from "../../constants/Colors";
import { getUserId } from "../../redux/stores/user";
import { Holiday } from "../../utils/types/holiday";
import { Trip } from "../../utils/types/trip";

type PastTripDetailProps = {
    navigation: any;
    route: any;
    userId: string;
};

const mapStateToProps = (state: any) => {
    return {
        userId: getUserId(state),
    };
};

const PastTripDetail = (props: PastTripDetailProps) => {
    const { navigation, route, userId } = props;

    const [trip, setTrip] = useState<Trip>(route.params.trip);
    const [path, setPath] = useState<GeoPoint[]>(
        JSON.parse(trip.path) as GeoPoint[],
    );
    const [holidays, setHolidays] = useState<Holiday[]>([]);
    const [showHoliday, setShowHoliday] = useState(false);
    const mapRef = useRef(null);

    useEffect(() => {
        getCreatedUserHoliday(userId).then((holidays) => {
            setHolidays(holidays);
        });
    }, []);

    const onChange = (
        key: keyof Trip,
        value: string | Date | Holiday | null,
    ): void => {
        setTrip({
            ...trip,
            [key]: value,
        });
    };

    console.log(trip.holidayId);

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
                    Past Trip
                </Text>
                <View style={{ alignItems: "center", marginTop: 20 }}>
                    <ListInput
                        value={trip.name}
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
                            fieldValue={
                                trip.holidayId
                                    ? holidays.find(
                                          (h) => h.id === trip.holidayId,
                                      )?.name
                                    : ""
                            }
                        >
                            Holiday
                        </ListLabel>
                    )}

                    {showHoliday && (
                        <>
                            <ListLabel
                                separator={true}
                                onPress={() => {
                                    onChange("holidayId", null);
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
                                        onChange(
                                            "holidayId",
                                            holiday.holidayId,
                                        );
                                        setShowHoliday(false);
                                    }}
                                >
                                    {holiday.name}
                                </ListLabel>
                            ))}
                        </>
                    )}
                    <ListInput
                        value={trip.description}
                        style={{ marginTop: 20 }}
                        onChangeText={(value: string): void => {
                            onChange("description", value);
                        }}
                        placeholder={"Enter trip description"}
                        borderRadius={{
                            top: true,
                            bottom: true,
                        }}
                    />
                </View>
                <View style={{ marginTop: 20 }}>
                    <Text
                        style={{
                            fontWeight: "bold",
                            fontSize: 24,
                            padding: 10,
                        }}
                    >
                        Start Time
                    </Text>
                    <Text
                        style={{
                            fontSize: 18,
                            padding: 10,
                        }}
                    >
                        {trip.startTime.toDate().toLocaleString()}
                    </Text>
                    {trip.endTime && (
                        <>
                            <Text
                                style={{
                                    fontWeight: "bold",
                                    fontSize: 24,
                                    padding: 10,
                                }}
                            >
                                End Time
                            </Text>
                            <Text
                                style={{
                                    fontSize: 18,
                                    padding: 10,
                                }}
                            >
                                {trip.endTime.toDate().toLocaleString()}
                            </Text>
                        </>
                    )}
                </View>
                <View>
                    <Text
                        style={{
                            fontWeight: "bold",
                            fontSize: 24,
                            padding: 10,
                            marginTop: 20,
                        }}
                    >
                        Map
                    </Text>
                    <MapView
                        style={{ height: 400, marginVertical: 5 }}
                        ref={mapRef}
                        onLayout={() => {
                            mapRef.current.fitToCoordinates(path, {
                                edgePadding: {
                                    top: 50,
                                    right: 50,
                                    bottom: 50,
                                    left: 50,
                                },
                                animated: true,
                            });
                        }}
                    >
                        <Polyline
                            coordinates={path}
                            strokeWidth={3}
                            strokeColor={tintColorLight}
                        />
                        <Marker
                            coordinate={{
                                latitude: path[0].latitude,
                                longitude: path[0].longitude,
                            }}
                            title={"Start"}
                            pinColor={"lime"}
                        />
                        <Marker
                            coordinate={{
                                latitude: path[path.length - 1].latitude,
                                longitude: path[path.length - 1].longitude,
                            }}
                            title={"End"}
                        />
                    </MapView>
                </View>
                <View style={{ marginTop: 20 }}>
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
                        photoURL={trip.thumbnail || ""}
                        onPress={() => {}}
                    />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default connect(mapStateToProps)(PastTripDetail);
