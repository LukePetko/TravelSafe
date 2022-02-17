import React, { useEffect, useState } from "react";
import { Pressable, View, Text, useThemeColor, TextProps } from "./Themed";

import { StyleSheet } from "react-native";
import { tintColorLight } from "../constants/Colors";
import DatePicker from "react-native-date-picker";

type ListCalendarProps = {
    borderRadius?: {
        top?: boolean;
        bottom?: boolean;
    };
    separator?: boolean;
    fieldValue?: string;
    icon?: any;
    textStyles?: any;
    showDatePicker?: boolean;
    showTimePicker?: boolean;
    date?: Date;
    setDate?: (date: Date) => void;
    time?: Date;
    setTime?: (time: Date) => void;
};

type CalendarProps = TextProps & ListCalendarProps;

const ListCalendar = (props: CalendarProps) => {
    const {
        borderRadius,
        separator,
        icon,
        textStyles,
        style,
        showDatePicker,
        showTimePicker,
        date,
        setDate,
        time,
        setTime,
        lightColor,
        darkColor,
        ...otherProps
    } = props;

    const [dateOpen, setDateOpen] = useState(false);
    const [timeOpen, setTimeOpen] = useState(false);

    const backgroundColor = useThemeColor(
        { light: lightColor, dark: darkColor },
        "fieldColor",
    );

    const grey = useThemeColor(
        { light: lightColor, dark: darkColor },
        "greyElement",
    );

    const secondaryGrey = useThemeColor(
        { light: lightColor, dark: darkColor },
        "secondaryGreyElement",
    );

    const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

    const setSeparator = () => {
        if (!separator) {
            if (dateOpen || timeOpen) {
                return {
                    borderBottomWidth: 1,
                    borderBottomColor: grey,
                };
            }
            return { borderBottomWidth: 0, borderBottomColor: grey };
        }
        return { borderBottomWidth: 1, borderBottomColor: grey };
    };

    const setBorderBottomRadius = () => {
        if (borderRadius?.bottom) {
            if (dateOpen || timeOpen) {
                return {
                    borderBottomLeftRadius: 0,
                    borderBottomRightRadius: 0,
                };
            }
            return {
                borderBottomLeftRadius: 10,
                borderBottomRightRadius: 10,
            };
        }
        return { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 };
    };

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
        <View style={style}>
            <Pressable
                onPress={() => {
                    setDateOpen(!dateOpen);
                    setTimeOpen(false);
                }}
                style={[
                    localStyles.pressable,
                    propStyles.border,
                    setBorderBottomRadius(),
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
                        style={[
                            setSeparator(),
                            {
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                                backgroundColor: "transparent",
                            },
                        ]}
                    >
                        <View style={localStyles.innerContainer}>
                            <Text
                                style={[localStyles.text, textStyles]}
                                {...otherProps}
                            />
                        </View>

                        {showDatePicker && (
                            <Pressable
                                onPress={() => {
                                    setDateOpen(!dateOpen);
                                    setTimeOpen(false);
                                }}
                                style={{
                                    backgroundColor: "transparent",
                                }}
                            >
                                <View
                                    style={[
                                        localStyles.dateContainer,
                                        { backgroundColor: secondaryGrey },
                                    ]}
                                >
                                    <Text
                                        style={[
                                            localStyles.text,
                                            {
                                                color: dateOpen
                                                    ? tintColorLight
                                                    : color,
                                            },
                                        ]}
                                    >
                                        {date?.toLocaleDateString()}
                                    </Text>
                                </View>
                            </Pressable>
                        )}
                        {showTimePicker && (
                            <Pressable
                                onPress={() => {
                                    setTimeOpen(!timeOpen);
                                    setDateOpen(false);
                                }}
                                style={{
                                    backgroundColor: "transparent",
                                }}
                            >
                                <View
                                    style={[
                                        localStyles.dateContainer,
                                        { backgroundColor: secondaryGrey },
                                    ]}
                                >
                                    <Text
                                        style={[
                                            localStyles.text,
                                            {
                                                color: timeOpen
                                                    ? tintColorLight
                                                    : color,
                                            },
                                        ]}
                                    >
                                        {time?.toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </Text>
                                </View>
                            </Pressable>
                        )}
                    </View>
                </View>
            </Pressable>
            {dateOpen && date && setDate && (
                <View
                    style={[
                        localStyles.datePicker,
                        propStyles.border,
                        {
                            backgroundColor,
                            paddingLeft: 26,
                            borderTopLeftRadius: 0,
                            borderTopRightRadius: 0,
                        },
                    ]}
                >
                    <View
                        style={[
                            propStyles.separator,
                            localStyles.datePickerInnerContainer,
                        ]}
                    >
                        <DatePicker
                            mode="date"
                            date={date}
                            onDateChange={(date) => setDate(date)}
                            textColor={color}
                        />
                    </View>
                </View>
            )}

            {timeOpen && time && setTime && (
                <View
                    style={[
                        localStyles.datePicker,
                        propStyles.border,
                        {
                            backgroundColor,
                            paddingLeft: 26,
                            borderTopLeftRadius: 0,
                            borderTopRightRadius: 0,
                        },
                    ]}
                >
                    <View
                        style={[
                            propStyles.separator,
                            localStyles.datePickerInnerContainer,
                        ]}
                    >
                        <DatePicker
                            mode="time"
                            date={time}
                            onDateChange={(time) => setTime(time)}
                            textColor={color}
                        />
                    </View>
                </View>
            )}
        </View>
    );
};

const localStyles = StyleSheet.create({
    pressable: {
        width: "90%",
    },
    outerContainer: {
        width: "100%",
        paddingLeft: 15,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "transparent",
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
        backgroundColor: "transparent",
    },
    text: {
        fontSize: 17,
    },
    value: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
    },
    dateContainer: {
        padding: 8,
        borderRadius: 10,
        marginRight: 8,
    },
    datePicker: {
        width: "90%",
        justifyContent: "center",
        alignItems: "center",
    },
    datePickerInnerContainer: {
        backgroundColor: "transparent",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        paddingRight: 15,
    },
});

export default ListCalendar;
