import { getDistance } from "geolib";
import React, { useEffect, useState } from "react";
import { Text } from "../../components/Themed";
import { CurrentTripInfo } from "../../utils/types/currentTripInfo";
import { Image, Pressable, StyleSheet, View } from "react-native";
import { distanceText } from "../../utils/distance";
import { getTimeDifference } from "../../utils/time";
import { SFSymbol } from "react-native-sfsymbols";
import { tintColorLight } from "../../constants/Colors";
import {
    end,
    getStartTime,
    getTripId,
    getTripName,
    resetDistance,
} from "../../redux/stores/trip";
import store from "../../redux/store";
import { stopLocationTracking } from "../../api/backgroundLocation";
import { connect, useDispatch } from "react-redux";
import { createPostAlertButton, endTripAlertButton } from "../../utils/alers";
import { endTrip } from "../../utils/trip";
import { getDistance as reduxGetDistance } from "../../redux/stores/trip";

type ContactDetailProps = {
    contact: CurrentTripInfo;
    userLocation: any;
    isOwn?: boolean;
    navigation?: any;
    ownDistance: number;
    ownTripName: string;
    ownTripStartTime: Date;
};

const mapStateToProps = (state: any) => ({
    ownDistance: reduxGetDistance(state),
    ownTripName: getTripName(state),
    ownTripStartTime: getStartTime(state),
});

const ContactDetail = (props: ContactDetailProps): JSX.Element => {
    const {
        contact,
        userLocation,
        isOwn,
        navigation,
        ownDistance,
        ownTripName,
        ownTripStartTime,
    } = props;

    const [distance, setDistance] = useState<number | null>(null);

    const dispatch = useDispatch();

    const endTripAction = () => {
        if (getTripId(store.getState())) {
            stopLocationTracking();
            endTrip();
            dispatch(end());
            dispatch(resetDistance());
        }
    };

    useEffect(() => {
        if (contact.location) {
            (async () => {
                const _userLocation = await userLocation();
                if (!_userLocation) return;
                const contactLocation = contact.location;
                const distance = getDistance(
                    {
                        latitude: _userLocation.coords.latitude,
                        longitude: _userLocation.coords.longitude,
                    },
                    {
                        latitude: contactLocation?.latitude || 0,
                        longitude: contactLocation?.longitude || 0,
                    },
                );

                setDistance(distance);
            })();
        }
    }, []);

    return (
        <View style={localStyles.container}>
            <View style={localStyles.imageContainer}>
                <Image
                    source={{
                        uri:
                            contact.profilePicture ||
                            "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg",
                    }}
                    style={{
                        width: 50,
                        height: 50,
                        borderRadius: 25,
                        borderColor: "white",
                        borderWidth: 2,
                    }}
                />
            </View>
            <View style={localStyles.textContainer}>
                <Text style={{ fontWeight: "bold" }}>{contact.username}</Text>
                {contact.location && !isOwn && (
                    <Text>
                        {distanceText(distance)} ⦁ {contact.tripName} ⦁{" "}
                        {contact &&
                            contact.updatedAt &&
                            getTimeDifference(contact.updatedAt.toDate())}
                    </Text>
                )}
                {!contact.location && !isOwn && <Text>No active trip</Text>}
                {isOwn && (
                    <Text>
                        {ownTripName} ⦁ {distanceText(ownDistance)} ⦁
                        {getTimeDifference(ownTripStartTime)}
                    </Text>
                )}
            </View>
            <View>
                {isOwn && (
                    <Pressable
                        onPress={() =>
                            endTripAlertButton(() => {
                                const tripId = getTripId(store.getState());
                                endTripAction();
                                createPostAlertButton(() => {
                                    navigation.navigate("ProfileTab", {
                                        screen: "NewPost",
                                        params: {
                                            tripId,
                                        },
                                    });
                                });
                            })
                        }
                    >
                        <SFSymbol
                            name="xmark"
                            weight="semibold"
                            scale="large"
                            color={tintColorLight}
                            size={18}
                            resizeMode="center"
                            multicolor={false}
                            style={{
                                width: 32,
                                height: 32,
                                marginHorizontal: 8,
                            }}
                        />
                    </Pressable>
                )}
            </View>
        </View>
    );
};

const localStyles = StyleSheet.create({
    container: {
        flexDirection: "row",
        paddingVertical: 10,
    },
    imageContainer: {
        paddingHorizontal: 10,
    },
    textContainer: {
        flexDirection: "column",
        justifyContent: "space-around",
    },
});

export default connect(mapStateToProps)(ContactDetail);
