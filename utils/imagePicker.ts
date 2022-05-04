import * as ImagePicker from "expo-image-picker";
import { ActionSheetIOS, useColorScheme } from "react-native";
import { getPictureBlob } from "./files";

export const pickImage = async (blobCallback: (blob: Blob) => void) => {
    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.1,
    });

    if (!result.cancelled) {
        const blob = await getPictureBlob(result.uri);
        blobCallback(blob);
    }
};

export const openImageDialog = (
    navigation: any,
    blobCallback: (blob: Blob) => void,
    colorScheme: "light" | "dark" | undefined = "light",
) =>
    ActionSheetIOS.showActionSheetWithOptions(
        {
            options: ["Cancel", "Take A Photo", "Choose From Library"],
            cancelButtonIndex: 0,
            userInterfaceStyle: colorScheme,
        },
        (buttonIndex: number): void => {
            if (buttonIndex === 0) {
                // cancel action
            } else if (buttonIndex === 1) {
                navigation.navigate("CameraModal");
            } else if (buttonIndex === 2) {
                pickImage(blobCallback);
            }
        },
    );
