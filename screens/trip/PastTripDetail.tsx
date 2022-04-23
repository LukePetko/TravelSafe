import { GeoPoint } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import MapView, { Polyline } from "react-native-maps";
import { connect } from "react-redux";
import { getCreatedUserHoliday } from "../../api/firestore/trips";
import ListInput from "../../components/ListInput";
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
    console.log("trip", trip);
    const [path, setPath] = useState<GeoPoint[]>(
        JSON.parse(trip.path) as GeoPoint[],
    );
    const [holidays, setHolidays] = useState<Holiday[]>([]);
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
                </View>
                <MapView
                    style={{ height: 400, marginVertical: 10 }}
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
                </MapView>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default connect(mapStateToProps)(PastTripDetail);
