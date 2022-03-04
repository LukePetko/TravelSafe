import { View, Image } from "react-native";
import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { styles } from "../../styles/global";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import { useSelector } from "react-redux";
import {
    getUserTripData,
    getPublicUserById,
    getUserById,
} from "../../api/firestore";
import {
    BACKGROUND_LOCATION_TASK,
    saveLocationToFirestore,
} from "../../utils/location";
import { Pressable, BottomSheet, Text } from "../../components/Themed";
import DefaultBottomSheet from "@gorhom/bottom-sheet";
import ContactDetail from "./ContactDetail";
import { CloseContact } from "../../utils/types/closeContact";

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
    const [contactsTripInfo, setContactsTripInfo] = useState<any>([]);

    const userId = useSelector((state: any) => state.user.user.payload);

    useEffect(() => {
        (async () => {
            const userData = await getUserById(userId);
            const contacts = userData?.closeContacts;
            setContactsTripInfo([]);
            contacts.forEach(
                async (contact: { id: string; username: string }) => {
                    const tripData = await getUserTripData(contact.id);
                    const closeContacts: CloseContact = {
                        username: tripData?.username,
                        location: tripData?.location
                            ? {
                                  latitude: tripData?.location.latitude,
                                  longitude: tripData?.location.longitude,
                                  latitudeDelta: 0.0001,
                                  longitudeDelta: 0.0001,
                              }
                            : null,
                        profilePicture: tripData?.profilePicture,
                        createdAt: tripData?.createdAt,
                        updatedAt: tripData?.updatedAt,
                    };

                    setContactsTripInfo((prevState: any) => [
                        ...prevState,
                        closeContacts,
                    ]);
                },
            );
        })();

        // if (userId) {
        //     TaskManager.defineTask(
        //         BACKGROUND_LOCATION_TASK,
        //         saveLocationToFirestore,
        //     );

        //     Location.startLocationUpdatesAsync(BACKGROUND_LOCATION_TASK, {
        //         accuracy: Location.Accuracy.Highest,
        //         distanceInterval: 200,
        //         foregroundService: {
        //             notificationTitle: "Using your location",
        //             notificationBody:
        //                 "To turn off, go back to the app and switch something off.",
        //         },
        //     });
        // }
    }, [userId]);

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

    useEffect(() => {
        console.log(mapRegion);
    }, [mapRegion]);

    // const bottomSheetRef = useRef<DefaultBottomSheet>(null);

    // variables
    const snapPoints = useMemo(() => ["5%", "50%"], []);

    // callbacks
    const handleSheetChanges = useCallback((index: number) => {
        console.log("handleSheetChanges", index);
    }, []);

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
                        {contactsTripInfo.map(
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
                        onChange={handleSheetChanges}
                    >
                        <View>
                            <Text
                                style={{
                                    fontWeight: "bold",
                                    fontSize: 32,
                                    padding: 10,
                                }}
                            >
                                Close Contacts
                            </Text>
                            {contactsTripInfo.map((contact: any) => (
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
                                            await Location.getBackgroundPermissionsAsync()
                                        }
                                    />
                                </Pressable>
                                // <Pressable
                                //     key={contact.username}
                                //     onPress={() =>
                                //         contact.location &&
                                //         setmapRegion(contact.location)
                                //     }
                                // >
                                //     <Text>{contact.username}</Text>
                            ))}
                        </View>
                    </BottomSheet>
                </>
            )}
        </View>
    );
};

export default MapScreen;
