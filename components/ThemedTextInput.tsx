import { View, TextInput, StyleSheet } from "react-native";
import React from "react";
import useColorScheme from "../hooks/useColorScheme";

interface Props {
    placeholder: string | null;
    value: string;
    onChangeText: (text: string) => void;
    autoCapitalize?: "none" | "sentences" | "words" | "characters";
    keyboardType: "default" | "email-address" | "numeric" | "phone-pad";
    secureTextEntry?: boolean;
    autoCorrect?: boolean;

    style?: any;
}

const ThemedTextInput = ({
    value,
    onChangeText,
    placeholder = null,
    autoCapitalize = "none",
    keyboardType = "default",
    secureTextEntry = false,
    autoCorrect = false,
    style,
}: Props) => {
    const theme = useColorScheme();

    return (
        <TextInput
            style={[
                style,
                localStyles.input,
                {
                    backgroundColor: theme === "light" ? "white" : "#1C1C1E",
                },
            ]}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            autoCapitalize={autoCapitalize}
            keyboardType={keyboardType}
            secureTextEntry={secureTextEntry}
            autoCorrect={autoCorrect}
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
