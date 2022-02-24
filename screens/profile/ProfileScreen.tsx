import { View, Text } from "../../components/Themed";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
    getUserById,
    getUserDocById,
    updateUserFile,
} from "../../api/firestore";
import ProfilePicture from "../../components/ProfilePicture";
import { ActionSheetIOS, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { uploadProfileImage } from "../../api/storage";
import { getPictureBlob } from "../../utils/files";
import { onSnapshot } from "firebase/firestore";

type ProfileProps = {
    navigation: any;
    editable?: boolean;
};

type UserStatePayload = {
    user: {
        payload: string;
    };
};

const ProfileScreen = (props: ProfileProps): JSX.Element => {
    const { navigation, editable } = props;

    const userID: string = useSelector(
        (state: { user: UserStatePayload }) => state.user.user.payload,
    );
    const [user, setUser] = useState<any>({});

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.1,
        });

        console.log(result);

        if (!result.cancelled) {
            const blob = await getPictureBlob(result.uri);
            const response = await uploadProfileImage(blob, userID);

            updateUserFile(userID, "profilePicture", response);
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
        // getUserById(userID).then((user) => {
        //     setUser(user);
        //     navigation.setOptions({
        //         title: user?.username,
        //     });
        // });

        const unSub = onSnapshot(getUserDocById(userID), (doc) => {
            setUser(doc.data());
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
