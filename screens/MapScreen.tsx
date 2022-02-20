import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { styles } from "../styles/global";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";

import * as Location from "expo-location";

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
                />
            )}
        </View>
    );
};

export default MapScreen;
