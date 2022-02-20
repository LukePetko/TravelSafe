import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { Camera } from "expo-camera";
import { styles } from "../styles/global";
import { CameraType } from "expo-camera/build/Camera.types";

const CameraModule = (): JSX.Element => {
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [type, setType] = useState<CameraType>(Camera.Constants.Type.back);

    useEffect((): void => {
        (async (): Promise<void> => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === "granted");
        })();
    }, []);

    if (hasPermission === null) {
        return <View />;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }
    return (
        <View style={styles.container}>
            <Camera type={type}>
                <View>
                    <TouchableOpacity
                        onPress={() => {
                            setType(
                                type === Camera.Constants.Type.back
                                    ? Camera.Constants.Type.front
                                    : Camera.Constants.Type.back,
                            );
                        }}
                    >
                        <Text> Flip </Text>
                    </TouchableOpacity>
                </View>
            </Camera>
        </View>
    );
};

export default CameraModule;
