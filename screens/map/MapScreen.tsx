import { View, Image, useColorScheme } from "react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { styles } from "../../styles/global";
import MapView, { LatLng, Marker, Polyline, Region } from "react-native-maps";

import * as Location from "expo-location";
import { connect } from "react-redux";

import { Pressable, BottomSheet, Text } from "../../components/Themed";
import ContactDetail from "./ContactDetail";
import { CurrentTripInfo } from "../../utils/types/currentTripInfo";
import {
    getCloseContactsQuery,
    getUserById,
} from "../../api/firestore/accounts";
import { onSnapshot } from "firebase/firestore";
import { getUserId } from "../../redux/stores/user";
import { User } from "../../utils/types/user";
import {
    getDistance,
    getPath,
    getTripId,
    getTripName,
} from "../../redux/stores/trip";
import Colors, { tintColorLight } from "../../constants/Colors";

type MapCoords = {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
};

type MapScreenProps = {
    navigation: any;
    userId?: string;
    tripId?: string;
    path?: any;
    distance?: number;
    tripName?: string;
};

const mapStateToProps = (state: any) => ({
    userId: getUserId(state),
    tripId: getTripId(state),
    path: getPath(state),
    distance: getDistance(state),
    tripName: getTripName(state),
});

type CloseContact = CurrentTripInfo & {
    marker?: any;
};

const MapScreen = (props: MapScreenProps): JSX.Element => {
    const { navigation, userId, tripId, path, distance, tripName } = props;

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [user, setUser] = useState<User | null>(null);
    const [contactsTripInfo, setContactsTripInfo] = useState<CloseContact[]>(
        [],
    );
    const [followUserLocation, setFollowUserLocation] = useState<boolean>(true);
    const [markers, setMarkers] = useState<any[]>([]);
    const colorScheme = useColorScheme();

    useEffect(() => {
        (async () => {
            const query = await getCloseContactsQuery();
            onSnapshot(query!, (snapshot) => {
                setContactsTripInfo(
                    snapshot.docs.map((doc) => doc.data() as CloseContact),
                );
            });
        })();
    }, [user]);

    useEffect((): void => {
        (async (): Promise<void> => {
            let { status }: { status: string } =
                await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                return;
            }
            setIsLoading(false);
        })();

        (async () => {
            const user = (await getUserById(userId!)) as User;
            setUser(user);

            console.log(user);
        })();
    }, []);

    useEffect(() => {
        console.log(
            contactsTripInfo[0]?.location,
            contactsTripInfo[0]?.username,
        );

        setMarkers(
            contactsTripInfo.map((contact) => ({
                coords: {
                    latitude: contact.location?.latitude || 0,
                    longitude: contact.location?.longitude || 0,
                },
                username: contact.username,
                profilePicture: contact.profilePicture,
            })),
        );
    }, [contactsTripInfo]);

    const map = useRef() as React.MutableRefObject<MapView>;

    // variables
    const snapPoints = useMemo(() => ["5%", "25%", "50%"], []);

    const animateToRegion = (coords: MapCoords): void => {
        const region: Region = {
            latitude: coords.latitude,
            longitude: coords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
        };
        map.current.animateToRegion(region, 1000);
    };

    return (
        <View style={styles.container}>
            {!isLoading && (
                <>
                    <MapView
                        // provider={PROVIDER_GOOGLE}
                        style={{ alignSelf: "stretch", height: "100%" }}
                        showsUserLocation={true}
                        followsUserLocation={followUserLocation}
                        onPanDrag={() => {
                            setFollowUserLocation(false);
                        }}
                        ref={map}
                    >
                        <Polyline
                            coordinates={path}
                            strokeWidth={5}
                            strokeColor={tintColorLight}
                        />
                        {markers.map((marker: any) => (
                            <Marker
                                key={marker.username}
                                coordinate={marker.coords}
                                title={marker.username}
                                tracksViewChanges={false}
                            >
                                <Image
                                    source={{
                                        uri:
                                            marker.profilePicture ||
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
                            </Marker>
                        ))}
                    </MapView>
                    <BottomSheet
                        // ref={bottomSheetRef}
                        index={1}
                        snapPoints={snapPoints}
                    >
                        <View>
                            {!!tripId && (
                                <>
                                    <Text
                                        style={{
                                            fontWeight: "bold",
                                            fontSize: 32,
                                            padding: 10,
                                        }}
                                    >
                                        Your active trip
                                    </Text>
                                    <Pressable
                                        key={userId}
                                        onPress={() =>
                                            path[path.length - 1] &&
                                            // setFollowUserLocation(true)
                                            animateToRegion(
                                                path[path.length - 1],
                                            )
                                        }
                                    >
                                        <ContactDetail
                                            contact={{
                                                id: userId || "",
                                                username: user?.username || "",
                                                profilePicture:
                                                    user?.profilePicture || "",
                                                location: path[path.length - 1],
                                                tripName: tripName || "",
                                                expoNotificationIds: [],
                                            }}
                                            userLocation={async () =>
                                                animateToRegion(
                                                    path[path.length - 1],
                                                )
                                            }
                                            isOwn={true}
                                            navigation={navigation}
                                        />
                                    </Pressable>
                                </>
                            )}
                            <Text
                                style={{
                                    fontWeight: "bold",
                                    fontSize: 32,
                                    padding: 10,
                                }}
                            >
                                Close Contacts
                            </Text>
                            {contactsTripInfo?.map((contact: any) => (
                                <Pressable
                                    key={contact.username}
                                    style={{
                                        borderBottomColor:
                                            colorScheme === "dark"
                                                ? Colors.dark.bottomBorderColor
                                                : Colors.light
                                                      .bottomBorderColor,
                                        borderBottomWidth: 1,
                                    }}
                                    onPress={() => {
                                        !!contact.tripName &&
                                            animateToRegion(contact.location);
                                    }}
                                >
                                    <ContactDetail
                                        contact={contact}
                                        userLocation={async () =>
                                            await Location.getLastKnownPositionAsync()
                                        }
                                    />
                                </Pressable>
                            ))}
                        </View>
                    </BottomSheet>
                </>
            )}
        </View>
    );
};

export default connect(mapStateToProps)(MapScreen);
