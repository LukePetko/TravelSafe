import * as WebBrowser from "expo-web-browser";
import { StyleSheet, TouchableOpacity } from "react-native";

import Colors from "../constants/Colors";
import { MonoText } from "./StyledText";
import { Text, View } from "./Themed";

type EditScreenInfoProps = {
    path: string;
};

const EditScreenInfo = (props: EditScreenInfoProps): JSX.Element => {
    const { path } = props;

    return (
        <View>
            <View style={localStyles.getStartedContainer}>
                <Text
                    style={localStyles.getStartedText}
                    lightColor="rgba(0,0,0,0.8)"
                    darkColor="rgba(255,255,255,0.8)"
                >
                    Open up the code for this screen:
                </Text>

                <View
                    style={[
                        localStyles.codeHighlightContainer,
                        localStyles.homeScreenFilename,
                    ]}
                    darkColor="rgba(255,255,255,0.05)"
                    lightColor="rgba(0,0,0,0.05)"
                >
                    <MonoText>{path}</MonoText>
                </View>

                <Text
                    style={localStyles.getStartedText}
                    lightColor="rgba(0,0,0,0.8)"
                    darkColor="rgba(255,255,255,0.8)"
                >
                    Change any of the text, save the file, and your app will
                    automatically update.
                </Text>
            </View>

            <View style={localStyles.helpContainer}>
                <TouchableOpacity
                    onPress={handleHelpPress}
                    style={localStyles.helpLink}
                >
                    <Text
                        style={localStyles.helpLinkText}
                        lightColor={Colors.light.tint}
                    >
                        Tap here if your app doesn't automatically update after
                        making changes
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const handleHelpPress = () => {
    WebBrowser.openBrowserAsync(
        "https://docs.expo.io/get-started/create-a-new-app/#opening-the-app-on-your-phonetablet",
    );
};

const localStyles = StyleSheet.create({
    getStartedContainer: {
        alignItems: "center",
        marginHorizontal: 50,
    },
    homeScreenFilename: {
        marginVertical: 7,
    },
    codeHighlightContainer: {
        borderRadius: 3,
        paddingHorizontal: 4,
    },
    getStartedText: {
        fontSize: 17,
        lineHeight: 24,
        textAlign: "center",
    },
    helpContainer: {
        marginTop: 15,
        marginHorizontal: 20,
        alignItems: "center",
    },
    helpLink: {
        paddingVertical: 15,
    },
    helpLinkText: {
        textAlign: "center",
    },
});

export default EditScreenInfo;
