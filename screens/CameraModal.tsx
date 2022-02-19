import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { Camera } from "expo-camera";
import { Pressable, useThemeColor } from "../components/Themed";
import { SFSymbol } from "react-native-sfsymbols";
import useColorScheme from "../hooks/useColorScheme";
import Svg, { Circle } from "react-native-svg";

type Props = {
    navigation: any;
};

const CameraModal = (props: Props) => {
    const { navigation } = props;
    const [hasPermission, setHasPermission] = React.useState<
        string | boolean | null
    >(null);
    const [type, setType] = React.useState(Camera.Constants.Type.back);

    let camera: any = null;

    React.useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === "granted");
        })();
    }, []);

    if (hasPermission === null) {
        return <View></View>;
    }

    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    return (
        <View style={styles.container}>
            <Camera
                style={styles.camera}
                type={type}
                ref={(ref) => (camera = ref)}
            >
                <View style={styles.buttonContainer}>
                    <View style={{ width: 52 }}></View>
                    <Pressable
                        style={styles.button}
                        onPress={() => {
                            camera
                                ?.takePictureAsync({
                                    quality: 1,
                                    base64: true,
                                    exif: true,
                                })
                                .then((data: any) => {
                                    console.log(data);
                                });
                        }}
                    >
                        <Svg width="80" height="80">
                            <Circle cx="40" cy="40" r="33.5" fill="white" />
                            <Circle
                                cx="40"
                                cy="40"
                                r="37.5"
                                fill="transparent"
                                stroke="white"
                                strokeWidth="3"
                            />
                        </Svg>
                    </Pressable>
                    <Pressable
                        style={styles.flipButton}
                        onPress={() => {
                            setType(
                                type === Camera.Constants.Type.back
                                    ? Camera.Constants.Type.front
                                    : Camera.Constants.Type.back,
                            );
                        }}
                    >
                        <SFSymbol
                            name="arrow.2.circlepath"
                            weight="semibold"
                            scale="large"
                            color="white"
                            size={18}
                            resizeMode="center"
                            multicolor={false}
                            style={{ width: 32, height: 32 }}
                        />
                    </Pressable>
                </View>
            </Camera>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "black",
    },
    camera: {
        flex: 1,
        justifyContent: "flex-end",
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        marginBottom: 50,
    },
    button: {
        backgroundColor: "transparent",
    },
    flipButton: {
        height: 52,
        backgroundColor: "rgba(68, 68, 78, 0.8)",
        padding: 10,
        borderRadius: 50,
    },
    text: {
        fontSize: 20,
        color: "black",
    },
});

export default CameraModal;
