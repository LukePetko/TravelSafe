import { Image, StyleSheet } from "react-native";
import React from "react";
import { Pressable } from "./Themed";

type ProfilePictureProps = {
    photoURL: string;
    onPress: () => void;
};

const ProfilePicture = (props: ProfilePictureProps): JSX.Element => {
    const { photoURL, onPress } = props;

    if (!onPress) {
        return <Image style={localStyles.image} source={{ uri: photoURL }} />;
    }

    return (
        <Pressable style={localStyles.container} onPress={onPress}>
            <Image style={localStyles.image} source={{ uri: photoURL }} />
        </Pressable>
    );
};

const localStyles = StyleSheet.create({
    container: {
        borderRadius: 125,
        backgroundColor: "transparent",
        alignItems: "center",
    },
    image: {
        width: 250,
        height: 250,
        borderRadius: 125,
    },
});

export default ProfilePicture;
