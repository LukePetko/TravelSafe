import { View, Image } from "react-native";
import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { styles } from "../../styles/global";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";

import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import { useSelector } from "react-redux";
import {
    getUserTripData,
    getPublicUserById,
    getUserById,
    getUserTripDocumentRef,
} from "../../api/firestore";

import { Pressable, BottomSheet, Text } from "../../components/Themed";
import DefaultBottomSheet from "@gorhom/bottom-sheet";
import ContactDetail from "./ContactDetail";
import { CurrentTripInfo } from "../../utils/types/currentTripInfo";
import { getCloseContactsQuery } from "../../api/firestore/accounts";
import { onSnapshot } from "firebase/firestore";
import { useStoreSelector } from "../../hooks/useStoreSelector";

type MapCoords = {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
};

const MapScreen = (): JSX.Element => {
    const [mapRegion, setmapRegion] = useState<MapCoords>({
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [contactsTripInfo, setContactsTripInfo] = useState<
        CurrentTripInfo[] | null
    >(null);
    const [userTripInfo, setUserTripInfo] = useState<CurrentTripInfo | null>(
        null,
    );

    const userId = useSelector((state: any) => state.user.userId.payload);
    const tripPath = useSelector((state: any) => state.trip.path.payload);
    const closeContacts = useStoreSelector(
        (state: any) => state.trip.closeContacts.payload,
    );

    console.log(userId);

    const unsubscribeUser = onSnapshot(
        getUserTripDocumentRef(userId),
        (snapshot) => {
            if (snapshot.exists()) {
                if (
                    userTripInfo?.tripName !== snapshot.data().tripName ||
                    userTripInfo?.location?.latitude !==
                        snapshot.data().location.latitude ||
                    userTripInfo?.location?.longitude !==
                        snapshot.data().location.longitude
                ) {
                    if (!snapshot.data().tripName) {
                        setUserTripInfo(null);
                        return;
                    }
                    const data = snapshot.data();
                    if (data) {
                        const userTripInfo = {
                            id: data.id,
                            username: data.username,
                            profilePicture: data.profilePicture,
                            location: data.location
                                ? {
                                      latitude: data.location?.latitude,
                                      longitude: data.location?.longitude,
                                      latitudeDelta: 0.0001,
                                      longitudeDelta: 0.0001,
                                  }
                                : null,
                            tripName: data.tripName,
                            createdAt: data.createdAt,
                            updatedAt: data.updatedAt,
                        };
                        setUserTripInfo(userTripInfo);
                    }
                }
            }
        },
    );

    useEffect(() => {
        console.log(tripPath, "tripPath");
    }, [tripPath]);

    useEffect(() => {
        (async () => {
            const closeContactsQuery = await getCloseContactsQuery(userId);

            if (closeContactsQuery) {
                const closeContactsUnsubscribe = onSnapshot(
                    closeContactsQuery,
                    (snapshot) => {
                        snapshot.forEach((doc) => {
                            const tripData = doc.data();
                            const closeContact: CurrentTripInfo = {
                                id: tripData?.id,
                                username: tripData?.username,
                                location: tripData?.location
                                    ? {
                                          latitude: tripData?.location.latitude,
                                          longitude:
                                              tripData?.location.longitude,
                                          latitudeDelta: 0.0001,
                                          longitudeDelta: 0.0001,
                                      }
                                    : null,
                                profilePicture: tripData?.profilePicture,
                                tripName: tripData?.tripName,
                                createdAt: tripData?.createdAt,
                                updatedAt: tripData?.updatedAt,
                            };

                            setContactsTripInfo((prev) => {
                                let contactsCopy: CurrentTripInfo[] = [];
                                if (prev) {
                                    contactsCopy = [...prev];
                                    const index = contactsCopy.findIndex(
                                        (contact) =>
                                            contact.id === tripData?.id,
                                    );
                                    if (index !== -1) {
                                        contactsCopy[index] = closeContact;
                                        return contactsCopy;
                                    }
                                    return [...contactsCopy, closeContact];
                                }
                                return [closeContact];
                            });
                        });
                    },
                );
                console.log(contactsTripInfo);
            }
        })();
    }, []);

    useEffect((): void => {
        (async (): Promise<void> => {
            let { status }: { status: string } =
                await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                return;
            }

            let location: Location.LocationObject =
                await Location.getCurrentPositionAsync({});
            const {
                latitude,
                longitude,
            }: { latitude: number; longitude: number } = location.coords;
            setmapRegion({
                latitude,
                longitude,
                latitudeDelta: 0.00001,
                longitudeDelta: 0.00001,
            });
            setIsLoading(false);
        })();
    }, []);

    // variables
    const snapPoints = useMemo(() => ["5%", "50%"], []);

    return (
        <View style={styles.container}>
            {!isLoading && (
                <>
                    <MapView
                        // provider={PROVIDER_GOOGLE}
                        style={{ alignSelf: "stretch", height: "100%" }}
                        region={mapRegion}
                        showsUserLocation={true}
                        // followsUserLocation={true}
                    >
                        <Polyline
                            coordinates={tripPath}
                            strokeWidth={5}
                            strokeColor={"red"}
                        />
                        {closeContacts?.map(
                            (contact: any) =>
                                contact.location && (
                                    <Marker
                                        key={contact.username}
                                        coordinate={contact.location}
                                        title={contact.username}
                                    >
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
                                    </Marker>
                                ),
                        )}
                    </MapView>
                    <BottomSheet
                        // ref={bottomSheetRef}
                        index={1}
                        snapPoints={snapPoints}
                    >
                        <View>
                            {!!userTripInfo && (
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
                                        key={userTripInfo.username}
                                        onPress={() =>
                                            userTripInfo.location &&
                                            setmapRegion(userTripInfo.location)
                                        }
                                    >
                                        <ContactDetail
                                            contact={userTripInfo}
                                            userLocation={async () => null}
                                            isOwn={true}
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
                                    onPress={() =>
                                        contact.location &&
                                        setmapRegion(contact.location)
                                    }
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

export default MapScreen;
