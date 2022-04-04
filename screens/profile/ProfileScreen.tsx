import { View, Text } from "../../components/Themed";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
    getPublicUserDocById,
    getUserById,
    getUserDocById,
    updateProfilePicture,
} from "../../api/firestore";
import ProfilePicture from "../../components/ProfilePicture";
import { ActionSheetIOS, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { uploadProfileImage } from "../../api/storage";
import { getPictureBlob } from "../../utils/files";
import { onSnapshot } from "firebase/firestore";
import { getUser, getUserId } from "../../redux/stores/user";
import store from "../../redux/store";

type ProfileProps = {
    navigation: any;
    route?: any;
};

type UserStatePayload = {
    userId: {
        payload: string;
    };
};

const ProfileScreen = (props: ProfileProps): JSX.Element => {
    const { navigation, route } = props;

    const userID: string = route.params
        ? route.params.id
        : getUserId(store.getState());

    const isOwn = !route.params;

    const [user, setUser] = useState<any>({});

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.1,
        });

        if (!result.cancelled) {
            const blob = await getPictureBlob(result.uri);
            const response = await uploadProfileImage(blob, userID);

            updateProfilePicture(userID, response);
        }
    };

    const onPress = () =>
        ActionSheetIOS.showActionSheetWithOptions(
            {
                options: ["Cancel", "Take A Photo", "Choose From Library"],
                // destructiveButtonIndex: 2,
                cancelButtonIndex: 0,
                userInterfaceStyle: "dark",
            },
            (buttonIndex: number): void => {
                if (buttonIndex === 0) {
                    // cancel action
                } else if (buttonIndex === 1) {
                    navigation.navigate("CameraModal");
                } else if (buttonIndex === 2) {
                    pickImage();
                }
            },
        );

    useEffect((): void => {
        if (isOwn) {
            setUser(getUser(store.getState()));
        } else {
            const unSub = onSnapshot(getPublicUserDocById(userID), (doc) => {
                setUser(doc.data());
            });
        }
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
            {user?.closeContacts?.map((contact: any) => (
                <Text key={contact.id}>
                    {contact.id} {contact.username}
                </Text>
            ))}
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
