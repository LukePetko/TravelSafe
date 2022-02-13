import { Platform, StyleSheet } from "react-native";
import { tintColorLight } from "../constants/Colors";
import { Appearance } from "react-native";

const colorScheme = Appearance.getColorScheme();
console.log("colorScheme: ", colorScheme);

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: "80%",
    },
    link: {
        marginTop: 15,
        paddingVertical: 15,
    },
    linkText: {
        fontSize: 14,
        color: "#2e78b7",
    },
    logoLarge: {
        fontFamily: "Bilbo",
        fontSize: 64,
    },
});
