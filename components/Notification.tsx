import { Image, StyleSheet } from "react-native";
import React from "react";
import { getTimeDifference } from "../utils/time";
import { View, Text } from "./Themed";
import { Timestamp } from "firebase/firestore";
import { SFSymbol } from "react-native-sfsymbols";

type NotificationProps = {
    type: number;
    id: string;
    username: string;
    profilePicture: string;
    createdAt: Timestamp;
    navigation?: any;
    onAccept: () => void;
    onDecline: () => void;
};

const Notification = (props: NotificationProps): JSX.Element => {
    const { type, id, username, profilePicture, createdAt, navigation } = props;

    let typeText;

    switch (type) {
        case 1:
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
                    <Text style={{ fontWeight: "bold" }}>{username}</Text>
                    <Text>Hello ⦁ {getTimeDifference(createdAt.toDate())}</Text>
                </View>
            </View>
            <View style={localStyles.buttonContainer}>
                <SFSymbol
                    name="checkmark"
                    weight="semibold"
                    scale="large"
                    color="green"
                    size={18}
                    resizeMode="center"
                    multicolor={false}
                    style={{ width: 32, height: 32, marginHorizontal: 8 }}
                />
                <SFSymbol
                    name="xmark"
                    weight="semibold"
                    scale="large"
                    color="red"
                    size={18}
                    resizeMode="center"
                    multicolor={false}
                    style={{ width: 32, height: 32, marginHorizontal: 8 }}
                />
            </View>
        </View>
    );
};

const localStyles = StyleSheet.create({
    container: {
        borderBottomWidth: 1,
        flexDirection: "row",
        paddingVertical: 10,
        justifyContent: "space-between",
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
