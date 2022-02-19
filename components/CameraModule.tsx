import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { Camera } from "expo-camera";
import { styles } from "../styles/global";

const CameraModule = () => {
    const [hasPermission, setHasPermission] = useState<string | boolean | null>(
        null,
    );
    const [type, setType] = useState(Camera.Constants.Type.back);

    useEffect(() => {
        (async () => {
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
