/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import {
    Text as DefaultText,
    View as DefaultView,
    ScrollView as DefaultScrollView,
    Pressable as DefaultPressable,
    KeyboardAvoidingView as DefaultKeyboardAvoidingView,
    Animated,
} from "react-native";

import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import DefaultDatePicker from "react-native-date-picker";

export const useThemeColor = (
    props: { light?: string; dark?: string },
    colorName: keyof typeof Colors.light & keyof typeof Colors.dark,
) => {
    const theme = useColorScheme();
    const colorFromProps = props[theme];

    if (colorFromProps) {
        return colorFromProps;
    } else {
        return Colors[theme][colorName];
    }
};

export type ThemeProps = {
    lightColor?: string;
    darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText["props"];
export type ViewProps = ThemeProps & DefaultView["props"];
export type ScrollViewProps = ThemeProps & DefaultScrollView["props"];
export type PressableProps = ThemeProps & DefaultPressable["props"];
export type KeyboardAvoidingViewProps = ThemeProps &
    DefaultKeyboardAvoidingView["props"];
export type DatePickerProps = ThemeProps & DefaultDatePicker["props"];

export const Text = (props: TextProps): JSX.Element => {
    const { style, lightColor, darkColor, ...otherProps } = props;
    const color: string = useThemeColor(
        { light: lightColor, dark: darkColor },
        "text",
    );

    return <DefaultText style={[{ color }, style]} {...otherProps} />;
};

export const View = (props: ViewProps) => {
    const { style, lightColor, darkColor, ...otherProps } = props;
    const backgroundColor: string = useThemeColor(
        { light: lightColor, dark: darkColor },
        "background",
    );

    return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
};

export const ScrollView = (props: ScrollViewProps): JSX.Element => {
    const { style, lightColor, darkColor, ...otherProps } = props;
    const backgroundColor: string = useThemeColor(
        { light: lightColor, dark: darkColor },
        "background",
    );

    return (
        <DefaultScrollView
            contentContainerStyle={[{ backgroundColor }, style]}
            {...otherProps}
        />
    );
};

export const KeyboardAvoidingView = (
    props: KeyboardAvoidingViewProps,
): JSX.Element => {
    const { style, lightColor, darkColor, ...otherProps } = props;
    const backgroundColor: string = useThemeColor(
        { light: lightColor, dark: darkColor },
        "background",
    );

    return (
        <DefaultKeyboardAvoidingView
            style={[{ backgroundColor }, style]}
            {...otherProps}
        />
    );
};

export const Pressable = (props: PressableProps): JSX.Element => {
    const { style, lightColor, darkColor, onPress, ...otherProps } = props;

    const animated: Animated.Value = new Animated.Value(1);
    const fadeIn = (): void => {
        Animated.timing(animated, {
            toValue: 0.4,
            duration: 100,
            useNativeDriver: true,
        }).start();
    };
    const fadeOut = (): void => {
        Animated.timing(animated, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
        }).start();
    };

    const backgroundColor: string = useThemeColor(
        { light: lightColor, dark: darkColor },
        "fieldColor",
    );

    return (
        <DefaultPressable
            onPressIn={fadeIn}
            onPressOut={fadeOut}
            style={[{ backgroundColor }, style]}
            onPress={onPress}
        >
            <Animated.View style={{ opacity: animated }} {...otherProps} />
        </DefaultPressable>
    );
};
