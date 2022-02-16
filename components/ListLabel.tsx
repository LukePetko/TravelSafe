import { View, Text as DefaultText, StyleSheet } from "react-native";
import React from "react";
import { Text, ThemeProps, useThemeColor } from "./Themed";
import { Feather } from "@expo/vector-icons";

type ListItemProps = {
    borderRadius?: {
        top?: boolean;
        bottom?: boolean;
    };
    separator?: boolean;
    showChevron?: boolean;
    fieldValue?: string;
};

type TextProps = DefaultText["props"] & ThemeProps & ListItemProps;

const ThemedListItem = (props: TextProps) => {
    const {
        borderRadius,
        separator,
        showChevron,
        fieldValue,
        style,
        lightColor,
        darkColor,
        ...otherProps
    } = props;

    const backgroundColor = useThemeColor(
        { light: lightColor, dark: darkColor },
        "fieldColor",
    );

    const grey = useThemeColor(
        { light: lightColor, dark: darkColor },
        "greyElement",
    );

    const propStyles = StyleSheet.create({
        border: {
            borderTopLeftRadius: borderRadius?.top ? 10 : 0,
            borderTopRightRadius: borderRadius?.top ? 10 : 0,
            borderBottomLeftRadius: borderRadius?.bottom ? 10 : 0,
            borderBottomRightRadius: borderRadius?.bottom ? 10 : 0,
        },
        separator: {
            borderBottomWidth: separator ? 1 : 0,
            borderBottomColor: grey,
        },
    });

    return (
        <View
            style={[
                localStyles.outerContainer,
                propStyles.border,
                {
                    backgroundColor,
                },
            ]}
        >
            <View style={[localStyles.innerContainer, propStyles.separator]}>
                <Text style={localStyles.text} {...otherProps} />
                <View style={localStyles.value}>
                    {!!fieldValue && (
                        <Text
                            style={[
                                localStyles.text,
                                {
                                    color: grey,
                                },
                            ]}
                        >
                            {fieldValue}
                        </Text>
                    )}
                    {showChevron && (
                        <Feather name="chevron-right" color={grey} size={19} />
                    )}
                </View>
            </View>
        </View>
    );
};

const localStyles = StyleSheet.create({
    outerContainer: {
        width: "90%",
        paddingLeft: 15,
        backgroundColor: "#fff",
    },
    innerContainer: {
        paddingVertical: 15,
        paddingLeft: 0,
        paddingRight: 8,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    text: {
        fontSize: 17,
    },
    value: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
    },
});

export default ThemedListItem;
