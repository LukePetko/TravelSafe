import {
    RefreshControl,
    StyleSheet,
    Image,
    useColorScheme,
    FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Pressable, View, Text } from "../../components/Themed";
import { Holiday } from "../../utils/types/holiday";
import { getUserHoliday } from "../../api/firestore";
import { getUserId } from "../../redux/stores/user";
import store from "../../redux/store";
import Colors, { tintColorLight } from "../../constants/Colors";

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

        navigation.setOptions({
            title: "Holidays",
            headerTintColor: tintColorLight,
            headerTitleStyle: {
                color: colorScheme === "dark" ? "#fff" : "#000",
            },
        });
    }, []);

    return (
        <View style={{ flex: 1 }}>
            <FlatList
                data={holidays}
                refreshControl={
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
                }
                ListHeaderComponent={
                    <Text
                        style={{
                            fontWeight: "bold",
                            fontSize: 32,
                            padding: 10,
                        }}
                    >
                        Holidays
                    </Text>
                }
                renderItem={({ item }) => (
                    <Pressable
                        onPress={() => {
                            navigation.navigate("HolidayDetail", {
                                holiday: item,
                            });
                        }}
                    >
                        <View
                            style={[
                                localStyles.container,
                                {
                                    borderBottomColor:
                                        colorScheme === "dark"
                                            ? Colors.dark.bottomBorderColor
                                            : Colors.light.bottomBorderColor,
                                },
                            ]}
                        >
                            <View style={localStyles.imageContainer}>
                                <Image
                                    source={{
                                        uri:
                                            item.thumbnail ||
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
                                    {item.name}
                                </Text>
                                <Text>
                                    {item.startTime.toDate().toDateString()}{" "}
                                    {item.endTime ? "-" : ""}{" "}
                                    {item.endTime?.toDate().toDateString()}
                                </Text>
                            </View>
                        </View>
                    </Pressable>
                )}
                keyExtractor={(item) => item.holidayId || ""}
            />
        </View>
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
