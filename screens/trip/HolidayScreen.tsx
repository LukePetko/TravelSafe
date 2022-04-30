import {
    RefreshControl,
    StyleSheet,
    Image,
    useColorScheme,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
    KeyboardAvoidingView,
    Pressable,
    ScrollView,
    View,
    Text,
} from "../../components/Themed";
import { Holiday } from "../../utils/types/holiday";
import { getUserHoliday } from "../../api/firestore/trips";
import { getUserId } from "../../redux/stores/user";
import store from "../../redux/store";
import { tintColorLight } from "../../constants/Colors";

type HolidayScreenProps = {
    navigation: any;
};

const HolidayScreen = (props: HolidayScreenProps) => {
    const { navigation } = props;
    const [holidays, setHolidays] = useState<Holiday[]>([]);

    const colorScheme = useColorScheme();

    useEffect(() => {
        getUserHoliday(getUserId(store.getState())).then((holidays) => {
            setHolidays(holidays);
        });
    }, []);

    navigation.setOptions({
        title: "Holidays",
        headerTintColor: tintColorLight,
        headerTitleStyle: { color: colorScheme === "dark" ? "#fff" : "#000" },
    });

    return (
        <KeyboardAvoidingView
            behavior={"padding"}
            style={{
                flex: 1,
                height: "100%",
            }}
            enabled
            keyboardVerticalOffset={90}
        >
            <ScrollView>
                <RefreshControl
                    refreshing={false}
                    onRefresh={() => {
                        getUserHoliday(getUserId(store.getState())).then(
                            (holidays) => {
                                setHolidays(holidays);
                            },
                        );
                    }}
                />
                {holidays.length > 0 && (
                    <Text
                        style={{
                            fontWeight: "bold",
                            fontSize: 32,
                            padding: 10,
                        }}
                    >
                        Past Holiday
                    </Text>
                )}
                {holidays.map((holiday) => (
                    <Pressable
                        key={holiday.holidayId}
                        onPress={() => {
                            navigation.navigate("HolidayDetail", {
                                holiday,
                            });
                        }}
                        style={{
                            backgroundColor: "transparent",
                        }}
                    >
                        <View style={localStyles.container}>
                            <View style={localStyles.imageContainer}>
                                <Image
                                    source={{
                                        uri:
                                            holiday.thumbnail ||
                                            "https://images.unsplash.com/photo-1642543492493-f57f7047be73?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
                                    }}
                                    style={{
                                        width: 50,
                                        height: 50,
                                        borderRadius: 25,
                                        borderColor: "white",
                                        borderWidth: 2,
                                    }}
                                />
                            </View>
                            <View style={localStyles.textContainer}>
                                <Text style={{ fontWeight: "bold" }}>
                                    {holiday.name}
                                </Text>
                                <Text>Time</Text>
                            </View>
                        </View>
                    </Pressable>
                ))}
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const localStyles = StyleSheet.create({
    container: {
        borderBottomWidth: 1,
        flexDirection: "row",
        paddingVertical: 10,
    },
    imageContainer: {
        paddingHorizontal: 10,
    },
    textContainer: {
        flexDirection: "column",
        justifyContent: "space-around",
    },
});

export default HolidayScreen;
