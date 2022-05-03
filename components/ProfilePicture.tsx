import { ActivityIndicator, Image, StyleSheet } from "react-native";
import React from "react";
import { Pressable, View } from "./Themed";

type ProfilePictureProps = {
    photoURL: string;
    isLoading: boolean;
    onPress: () => void;
};

const ProfilePicture = (props: ProfilePictureProps): JSX.Element => {
    const { photoURL, onPress, isLoading } = props;

    if (!onPress) {
        return <Image style={localStyles.image} source={{ uri: photoURL }} />;
    }

    return (
        <Pressable style={localStyles.container} onPress={onPress}>
            <Image style={localStyles.image} source={{ uri: photoURL }} />

            {isLoading && (
                <View style={localStyles.overlay}>
                    <ActivityIndicator />
                </View>
            )}
        </Pressable>
    );
};

const localStyles = StyleSheet.create({
    container: {
        backgroundColor: "transparent",
        alignItems: "center",
    },
    image: {
        width: 250,
        height: 250,
        borderRadius: 125,
    },
    overlay: {
        position: "absolute",
        top: 0,
        left: 0,
        width: 250,
        height: 250,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 125,
    },
});

export default ProfilePicture;
