import { TextInput, StyleSheet } from "react-native";
import React from "react";
import { ThemeProps, useThemeColor, View } from "./Themed";

type ListItemProps = {
    borderRadius?: {
        top?: boolean;
        bottom?: boolean;
    };
    separator?: boolean;
};

type TextFiendProps = TextInput["props"] & ThemeProps & ListItemProps;

const ListInput = (props: TextFiendProps): JSX.Element => {
    const {
        borderRadius,
        separator,
        style,
        lightColor,
        darkColor,
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

    const color: string = useThemeColor(
        { light: lightColor, dark: darkColor },
        "text",
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
                style,
            ]}
        >
            <View style={[localStyles.innerContainer, propStyles.separator]}>
                <TextInput
                    style={[
                        localStyles.input,
                        propStyles.border,
                        {
                            backgroundColor,
                            color,
                            borderTopLeftRadius: 0,
                            borderBottomLeftRadius: 0,
                        },
                    ]}
                    {...otherProps}
                />
            </View>
        </View>
    );
};

const localStyles = StyleSheet.create({
    outerContainer: {
        width: "90%",
        paddingLeft: 15,
    },
    innerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    input: {
        width: "100%",
        paddingVertical: 15,
        paddingLeft: 0,
        paddingRight: 8,
        fontSize: 17,
    },
});

export default ListInput;
