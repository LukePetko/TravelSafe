import { Platform, StyleSheet } from "react-native";
import { tintColorLight } from "../constants/Colors";

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
    button: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        // padding: "18px 16px",
        position: "absolute",
        // width: "359px",
        // height: "54px",
        // left: "16px",
        // top: "397px",
        backgroundColor: "#FFF",
        // backdropFilter: "blur(80px)",
        borderRadius: 13,
    },
    text: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: "bold",
        letterSpacing: 0.25,
        color: tintColorLight,
    },
});
