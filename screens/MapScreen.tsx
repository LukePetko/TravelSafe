import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { styles } from "../styles/global";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import { useSelector } from "react-redux";
import {
    getLocationById,
    getPublicUserById,
    getUserById,
} from "../api/firestore";
import {
    BACKGROUND_LOCATION_TASK,
    saveLocationToFirestore,
} from "../utils/location";

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
    const [contactLocation, setContactLocation] = useState<any>({});
    const [contactUsername, setContactUsername] = useState<string>("");

    const userId = useSelector((state: any) => state.user.user.payload);

    useEffect(() => {
        (async () => {
            const userData = await getUserById(userId);
            const contactId = userData?.closeContacts[0].id;
            const contactData = await getPublicUserById(contactId);
            const locationData = await getLocationById(contactId);
            console.log(contactData);
            setContactLocation({
                latitude: locationData?.location.latitude,
                longitude: locationData?.location.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            });
            setContactUsername(contactData?.username);
        })();

        if (userId) {
            TaskManager.defineTask(
                BACKGROUND_LOCATION_TASK,
                saveLocationToFirestore,
            );

            Location.startLocationUpdatesAsync(BACKGROUND_LOCATION_TASK, {
                accuracy: Location.Accuracy.Highest,
                distanceInterval: 200,
                foregroundService: {
                    notificationTitle: "Using your location",
                    notificationBody:
                        "To turn off, go back to the app and switch something off.",
                },
            });
        }
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

    return (
        <View style={styles.container}>
            {!isLoading && (
                <MapView
                    // provider={PROVIDER_GOOGLE}
                    style={{ alignSelf: "stretch", height: "100%" }}
                    region={mapRegion}
                    showsUserLocation={true}
                    // followsUserLocation={true}
                >
                    {contactLocation && (
                        <Marker
                            coordinate={contactLocation}
                            title={contactUsername}
                        />
                    )}
                </MapView>
            )}
        </View>
    );
};

export default MapScreen;
