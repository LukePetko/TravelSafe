import { Image, Pressable, StyleSheet } from "react-native";
import React from "react";
import { getTimeDifference } from "../utils/time";
import { View, Text } from "./Themed";
import { Timestamp } from "firebase/firestore";
import { SFSymbol } from "react-native-sfsymbols";
import { width } from "../utils/dimensions";

type NotificationProps = {
    type: number;
    senderId: string;
    username: string;
    profilePicture: string;
    createdAt: Timestamp;
    navigation?: any;
    onAccept: () => void;
    onDecline: () => void;
};

const Notification = (props: NotificationProps): JSX.Element => {
    const {
        type,
        senderId,
        username,
        profilePicture,
        createdAt,
        navigation,
        onAccept,
        onDecline,
    } = props;

    let typeText;

    switch (type) {
        case 1:
            typeText = "Close contact request";
            break;
        case 2:
            typeText = `${username} didn't move for over an hour`;
            break;
        default:
            break;
    }

    return (
        <View style={localStyles.container}>
            <View style={{ flexDirection: "row" }}>
                <View style={localStyles.imageContainer}>
                    <Image
                        source={{
                            uri:
                                profilePicture ||
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
                </View>
                <View style={localStyles.textContainer}>
                    <View style={{ flexDirection: "row" }}>
                        <Text style={{ fontWeight: "bold" }}>{username}</Text>
                        <Text>⦁ {getTimeDifference(createdAt.toDate())}</Text>
                    </View>
                    <Text>{typeText}</Text>
                </View>
            </View>
            {type === 1 && (
                <View style={localStyles.buttonContainer}>
                    <Pressable onPress={onAccept}>
                        <SFSymbol
                            name="checkmark"
                            weight="semibold"
                            scale="large"
                            color="green"
                            size={18}
                            resizeMode="center"
                            multicolor={false}
                            style={{
                                width: 32,
                                height: 32,
                                marginHorizontal: 8,
                            }}
                        />
                    </Pressable>
                    <Pressable>
                        <SFSymbol
                            name="xmark"
                            weight="semibold"
                            scale="large"
                            color="red"
                            size={18}
                            resizeMode="center"
                            multicolor={false}
                            style={{
                                width: 32,
                                height: 32,
                                marginHorizontal: 8,
                            }}
                        />
                    </Pressable>
                </View>
            )}
            {type === 2 && (
                <View style={localStyles.buttonContainer}>
                    <Pressable onPress={onAccept}>
                        <SFSymbol
                            name="xmark"
                            weight="semibold"
                            scale="large"
                            color="grey"
                            size={18}
                            resizeMode="center"
                            multicolor={false}
                            style={{
                                width: 32,
                                height: 32,
                                marginHorizontal: 8,
                            }}
                        />
                    </Pressable>
                </View>
            )}
        </View>
    );
};

const localStyles = StyleSheet.create({
    container: {
        borderBottomWidth: 1,
        flexDirection: "row",
        paddingVertical: 10,
        justifyContent: "space-between",
        width,
    },
    imageContainer: {
        paddingHorizontal: 10,
    },
    textContainer: {
        flexDirection: "column",
        justifyContent: "space-around",
    },
    buttonContainer: {
        marginHorizontal: 20,
        alignItems: "center",
        justifyContent: "space-around",
        flexDirection: "row",
    },
});

export default Notification;
