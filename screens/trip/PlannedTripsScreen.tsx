import React, { useEffect, useState } from "react";
import { getCreatedUserTrips } from "../../api/firestore";
import { View, Text, Pressable } from "../../components/Themed";
import {
    StyleSheet,
    Image,
    useColorScheme,
    RefreshControl,
    FlatList,
} from "react-native";
import store from "../../redux/store";
import { getUserId } from "../../redux/stores/user";
import { Trip } from "../../utils/types/trip";
import Colors, { tintColorLight } from "../../constants/Colors";

type PlannedTripsScreenProps = {
    navigation: any;
};

const PlannedTripsScreen = (props: PlannedTripsScreenProps) => {
    const { navigation } = props;
    const userId = getUserId(store.getState());
    const [trips, setTrips] = useState<Trip[]>([]);

    useEffect(() => {
        getCreatedUserTrips(userId).then((trips) => {
            setTrips(trips);
        });

        navigation.setOptions({
            headerTintColor: tintColorLight,
            headerTitleStyle: {
                color: colorScheme === "dark" ? "#fff" : "#000",
            },
        });
    }, []);

    const colorScheme = useColorScheme();

    return (
        <View style={{ flex: 1 }}>
            <FlatList
                data={trips}
                refreshControl={
                    <RefreshControl
                        refreshing={false}
                        onRefresh={() => {
                            getCreatedUserTrips(userId).then((trips) => {
                                setTrips(trips);
                            });
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
                        Past Trips
                    </Text>
                }
                renderItem={({ item }) => {
                    return (
                        <Pressable
                            onPress={() => {
                                navigation.navigate("PlannedTripDetail", {
                                    tripId: item.id,
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
                                                : Colors.light
                                                      .bottomBorderColor,
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
                                        {item.startTime.toDate().toDateString()}
                                    </Text>
                                </View>
                            </View>
                        </Pressable>
                    );
                }}
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

export default PlannedTripsScreen;
