import React, { useEffect, useState } from "react";
import { getCreatedUserTrips } from "../../api/firestore";
import {
    View,
    Text,
    KeyboardAvoidingView,
    ScrollView,
    Pressable,
} from "../../components/Themed";
import { StyleSheet, Image } from "react-native";
import store from "../../redux/store";
import { getUserId } from "../../redux/stores/user";
import { Trip } from "../../utils/types/trip";

const PlannedTripsScreen = () => {
    const userId = getUserId(store.getState());
    const [trips, setTrips] = useState<Trip[]>([]);

    useEffect(() => {
        getCreatedUserTrips(userId).then((trips) => {
            setTrips(trips);
        });
    }, []);

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
                <Text
                    style={{
                        fontWeight: "bold",
                        fontSize: 32,
                        padding: 10,
                    }}
                >
                    Planned Trips
                </Text>
                {trips.map((trip) => (
                    <Pressable key={trip.id}>
                        <View style={localStyles.container}>
                            <View style={localStyles.imageContainer}>
                                <Image
                                    source={{
                                        uri:
                                            trip.thumbnail ||
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
                                    {trip.name}
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

export default PlannedTripsScreen;
