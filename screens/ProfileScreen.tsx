import { View, Text } from "../components/Themed";
import React, { useEffect, useState } from "react";
import { styles } from "../styles/global";
import { useSelector } from "react-redux";
import { getUserById } from "../api/firestore";
import ProfilePicture from "../components/ProfilePicture";
import { ActionSheetIOS, StyleSheet } from "react-native";

type ProfileProps = {
    navigation: any;
    editable?: boolean;
};

const ProfileScreen = (props: ProfileProps) => {
    const { navigation, editable } = props;

    const userID = useSelector(
        (state: { user: any }) => state.user.user.payload,
    );
    const [user, setUser] = useState<any>({});

    const onPress = () =>
        ActionSheetIOS.showActionSheetWithOptions(
            {
                options: ["Cancel", "Take A Photo", "Choose From Library"],
                // destructiveButtonIndex: 2,
                cancelButtonIndex: 0,
                userInterfaceStyle: "dark",
            },
            (buttonIndex) => {
                if (buttonIndex === 0) {
                    // cancel action
                } else if (buttonIndex === 1) {
                    console.log(Math.floor(Math.random() * 100) + 1);
                    navigation.navigate("CameraModal");
                } else if (buttonIndex === 2) {
                    console.log("🔮");
                }
            },
        );

    useEffect(() => {
        getUserById(userID).then((user) => {
            setUser(user);
            navigation.setOptions({
                title: user?.username,
            });
        });
    }, []);

    if (!user) {
        return <View />;
    }

    return (
        <View style={localStyles.container}>
            <ProfilePicture
                photoURL={
                    user?.profilePicture ||
                    "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"
                }
                onPress={onPress}
            />
            <Text>email: {user?.email}</Text>
            <Text>followers: {user?.followerCount}</Text>
            <Text>following: {user?.followingCount}</Text>
        </View>
    );
};

const localStyles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 20,
        alignItems: "center",
    },
});

export default ProfileScreen;
