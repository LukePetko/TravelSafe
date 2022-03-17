import { View, Text as DefaultText, StyleSheet } from "react-native";
import React from "react";
import {
    Pressable,
    PressableProps,
    Text,
    ThemeProps,
    useThemeColor,
} from "./Themed";
import { Feather } from "@expo/vector-icons";

type ListItemProps = {
    borderRadius?: {
        top?: boolean;
        bottom?: boolean;
    };
    separator?: boolean;
    showChevron?: boolean;
    fieldValue?: string;
    icon?: any;
    textStyles?: any;
};

type TextProps = DefaultText["props"] &
    ThemeProps &
    ListItemProps &
    PressableProps;

const ThemedListItem = (props: TextProps): JSX.Element => {
    const {
        borderRadius,
        separator,
        showChevron,
        fieldValue,
        icon,
        textStyles,
        style,
        lightColor,
        darkColor,
        disabled,
        onPress,
        ...otherProps
    } = props;

    const backgroundColor: string = useThemeColor(
        { light: lightColor, dark: darkColor },
        "fieldColor",
    );

    const grey: string = useThemeColor(
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
        <Pressable
            onPress={onPress}
            style={[
                localStyles.pressable,
                propStyles.border,
                style,
                {
                    backgroundColor,
                },
            ]}
        >
            <View style={[localStyles.outerContainer]}>
                {!!icon && (
                    <View style={localStyles.iconContainer}>{icon}</View>
                )}
                <View
                    style={[localStyles.innerContainer, propStyles.separator]}
                >
                    <Text
                        style={[localStyles.text, textStyles]}
                        {...otherProps}
                    />
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
                            <Feather
                                name="chevron-right"
                                color={grey}
                                size={19}
                            />
                        )}
                    </View>
                </View>
            </View>
        </Pressable>
    );
};

const localStyles = StyleSheet.create({
    pressable: {
        width: "90%",
        backgroundColor: "#fff",
    },
    outerContainer: {
        width: "100%",
        paddingLeft: 15,
        flexDirection: "row",
        alignItems: "center",
    },
    iconContainer: {
        paddingRight: 15,
    },
    innerContainer: {
        flex: 1,
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
