import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { styles } from "../styles/global";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";

import * as Location from "expo-location";

const MapScreen = () => {
    const [mapRegion, setmapRegion] = useState({
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            const { latitude, longitude } = location.coords;
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
                    followsUserLocation={true}
                />
            )}
        </View>
    );
};

export default MapScreen;
