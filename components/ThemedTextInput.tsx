import { TextInput, StyleSheet, Animated } from "react-native";
import React from "react";
import { ThemeProps, useThemeColor } from "./Themed";

type TextFiendProps = TextInput["props"] & ThemeProps;

const ThemedTextInput = (props: TextFiendProps) => {
    const { style, lightColor, darkColor, ...otherProps } = props;

    const backgroundColor = useThemeColor(
        { light: lightColor, dark: darkColor },
        "fieldColor",
    );

    const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

    return (
        <TextInput
            style={[style, localStyles.input, { backgroundColor, color }]}
            {...otherProps}
        />
    );
};

const localStyles = StyleSheet.create({
    input: {
        width: "90%",
        fontSize: 17,
        padding: 15,
        borderRadius: 10,
        margin: 7.5,
    },
});

export default ThemedTextInput;
