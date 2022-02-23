import {
    View,
    StyleSheet,
    ImageBackground,
    TouchableOpacity,
} from "react-native";
import React, { useEffect } from "react";
import { Camera } from "expo-camera";
import { Pressable, Text } from "../../components/Themed";
import { SFSymbol } from "react-native-sfsymbols";
import Svg, { Circle } from "react-native-svg";
import { tintColorLight } from "../../constants/Colors";
import {
    CameraCapturedPicture,
    CameraType,
} from "expo-camera/build/Camera.types";
import * as ImagePicker from "expo-image-picker";

type Props = {
    navigation: any;
};

const CameraModal = (props: Props): JSX.Element => {
    const { navigation } = props;
    const [hasPermission, setHasPermission] = React.useState<boolean | null>(
        null,
    );
    const [type, setType] = React.useState<CameraType>(
        Camera.Constants.Type.back,
    );
    const [photo, setPhoto] = React.useState<CameraCapturedPicture | null>(
        null,
    );

    let camera: Camera | null;

    const takePicture = async () => {
        if (camera) {
            const photo: CameraCapturedPicture =
                await camera.takePictureAsync();
            setPhoto(photo);
        }
    };

    // TODO!!!
    const savePicture = async () => {
        navigation.goBack();
    };

    const retakePicture = () => {
        navigation.setOptions({
            headerLeft: () => {},
        });
        setPhoto(null);
    };

    useEffect((): void => {
        (async (): Promise<void> => {
            const { status }: { status: string } =
                await Camera.requestCameraPermissionsAsync();
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
        <View style={localStyles.container}>
            {photo ? (
                <CameraPreview
                    photo={photo}
                    retakePicture={retakePicture}
                    savePicture={savePicture}
                    navigation={navigation}
                />
            ) : (
                <Camera
                    style={localStyles.camera}
                    type={type}
                    ref={(ref) => (camera = ref)}
                >
                    <View style={localStyles.buttonContainer}>
                        <View style={{ width: 52 }}></View>
                        <Pressable
                            style={localStyles.button}
                            onPress={(): void => {
                                takePicture();
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
                            style={localStyles.flipButton}
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
            )}
        </View>
    );
};

const CameraPreview = ({
    photo,
    retakePicture,
    savePicture,
    navigation,
}: any): JSX.Element => {
    useEffect((): void => {
        navigation.setOptions({
            headerLeft: (): JSX.Element => (
                <Pressable
                    onPress={(): void => {
                        retakePicture();
                    }}
                >
                    <Text
                        style={{
                            fontSize: 17,
                        }}
                    >
                        Re-Take
                    </Text>
                </Pressable>
            ),
            headerRight: (): JSX.Element => (
                <Pressable
                    onPress={(): void => {
                        savePicture();
                    }}
                >
                    <Text
                        style={{
                            fontSize: 17,
                            color: tintColorLight,
                        }}
                    >
                        Done
                    </Text>
                </Pressable>
            ),
        });
    }, []);

    return (
        <View
            style={{
                backgroundColor: "transparent",
                flex: 1,
                width: "100%",
                height: "100%",
            }}
        >
            <ImageBackground
                source={{ uri: photo && photo.uri }}
                style={{
                    flex: 1,
                }}
            />
        </View>
    );
};

const localStyles = StyleSheet.create({
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
});

export default CameraModal;
