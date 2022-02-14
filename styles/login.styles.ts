import { StyleSheet } from "react-native";
import { tintColorLight } from "../constants/Colors";

export const loginStyles = StyleSheet.create({
    button: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        padding: 15,
        width: "90%",
        borderRadius: 13,
        margin: 7.5,
    },
    text: {
        fontSize: 20,
        lineHeight: 21,
        fontWeight: "normal",
        letterSpacing: 0.25,
        color: tintColorLight,
    },
});
