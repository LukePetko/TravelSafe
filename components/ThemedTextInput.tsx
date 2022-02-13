import { View, TextInput, StyleSheet } from "react-native";
import React from "react";

interface Props {
    placeholder: string | null;
    value: string;
    onChangeText: (text: string) => void;
    autoCapitalize?: "none" | "sentences" | "words" | "characters";
    keyboardType: "default" | "email-address" | "numeric" | "phone-pad";
    secureTextEntry?: boolean;
}

const ThemedTextInput = ({
    value,
    onChangeText,
    placeholder = null,
    autoCapitalize = "none",
    keyboardType = "default",
    secureTextEntry = false,
}: Props) => {
    return (
        <TextInput
            style={localStyles.input}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            autoCapitalize={autoCapitalize}
            keyboardType={keyboardType}
            secureTextEntry={secureTextEntry}
        />
    );
};

const localStyles = StyleSheet.create({
    input: {
        width: "90%",
        fontSize: 17,
        backgroundColor: "white",
        padding: 15,
        borderRadius: 10,
        margin: 7.5,
    },
});

export default ThemedTextInput;
