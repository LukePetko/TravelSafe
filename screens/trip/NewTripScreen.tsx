import React, { useEffect, useState } from "react";
import { SFSymbol } from "react-native-sfsymbols";
import { createTrip } from "../../api/firestore";
import ListCalendar from "../../components/ListCalendar";
import ListInput from "../../components/ListInput";
import ListLabel from "../../components/ListLabel";
import ProfilePicture from "../../components/ProfilePicture";
import {
    View,
    Text,
    KeyboardAvoidingView,
    ScrollView,
    Pressable,
} from "../../components/Themed";
import { tintColorDark, tintColorLight } from "../../constants/Colors";
import store from "../../redux/store";
import { getUserId } from "../../redux/stores/user";
import { Trip } from "../../utils/types/trip";
import { newTripValidation } from "../../utils/validations";

type NewTripScreenProps = {
    navigation: any;
    route: any;
};

export type NewTripState = {
    name: string;
    description: string;
    startTime: Date;
    endTime: Date;
    thumbnail: string;
};

const NewTripScreen = (props: NewTripScreenProps) => {
    const { navigation, route } = props;

    const [tripState, setTripState] = useState<NewTripState>({
        name: "",
        description: "",
        startTime: new Date(),
        endTime: new Date(),
        thumbnail:
            "https://images.unsplash.com/photo-1642543492493-f57f7047be73?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    });

    const onChange = (key: keyof NewTripState, value: string | Date): void => {
        setTripState({
            ...tripState,
            [key]: value,
        });
    };

    const userId = getUserId(store.getState());

    const onSubmit = () => {
        console.log(newTripValidation(tripState));

        const trip: Trip = {
            userId: userId,
            ...tripState,
            status: "created",
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        console.log(createTrip(trip));
    };

    navigation.setOptions({
        headerTitle: "New Trip",
        headerLeft: () => (
            <Pressable
                onPress={() => {
                    navigation.goBack();
                }}
            >
                <View
                    style={{
                        flexDirection: "row",
                        backgroundColor: "transparent",
                    }}
                >
                    <SFSymbol
                        name="chevron.backward"
                        size={18}
                        color={tintColorLight}
                        style={{
                            marginHorizontal: 10,
                        }}
                    />
                    <Text
                        style={{
                            color: tintColorLight,
                            fontSize: 18,
                        }}
                    >
                        Back
                    </Text>
                </View>
            </Pressable>
        ),
        headerRight: () => (
            <Pressable onPress={onSubmit}>
                <Text
                    style={{
                        color: tintColorLight,
                        fontSize: 18,
                    }}
                >
                    Save
                </Text>
            </Pressable>
        ),
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
                <Text
                    style={{
                        fontWeight: "bold",
                        fontSize: 32,
                        padding: 10,
                    }}
                >
                    New Trip
                </Text>
                <View style={{ alignItems: "center", marginTop: 20 }}>
                    <ListInput
                        value={tripState.name}
                        onChangeText={(value: string): void => {
                            onChange("name", value);
                        }}
                        placeholder={"Enter trip name"}
                        separator={true}
                        borderRadius={{ top: true }}
                    />
                    <ListLabel
                        showChevron={true}
                        borderRadius={{ bottom: true }}
                    >
                        Holiday
                    </ListLabel>

                    <ListCalendar
                        style={{ marginTop: 20 }}
                        borderRadius={{ top: true }}
                        separator={true}
                        showDatePicker={true}
                        showTimePicker={true}
                        setDate={(date: Date): void => {
                            onChange("startTime", date);
                        }}
                        setTime={(time: Date): void => {
                            onChange("startTime", time);
                        }}
                        date={tripState.startTime}
                        time={tripState.endTime}
                        minimumDate={new Date()}
                    >
                        Start Time
                    </ListCalendar>
                    <ListCalendar
                        borderRadius={{ bottom: true }}
                        showDatePicker={true}
                        showTimePicker={true}
                        setDate={(date: Date): void => {
                            onChange("endTime", date);
                        }}
                        setTime={(time: Date): void => {
                            onChange("endTime", time);
                        }}
                        date={tripState.endTime}
                        time={tripState.endTime}
                        minimumDate={tripState.startTime}
                    >
                        End Time
                    </ListCalendar>

                    <ListLabel
                        showChevron={true}
                        borderRadius={{ top: true }}
                        separator={true}
                        style={{ marginTop: 20 }}
                    >
                        Start Place
                    </ListLabel>
                    <ListLabel
                        showChevron={true}
                        borderRadius={{ bottom: true }}
                    >
                        End Place
                    </ListLabel>

                    <ListInput
                        value={tripState.description}
                        onChangeText={(value: string): void => {
                            onChange("description", value);
                        }}
                        placeholder={"Enter Description"}
                        borderRadius={{ top: true, bottom: true }}
                        style={{ marginTop: 20 }}
                    />
                    <Text
                        style={{
                            fontWeight: "bold",
                            fontSize: 32,
                            padding: 10,
                        }}
                    >
                        Thumbnail
                    </Text>
                    <ProfilePicture
                        photoURL={tripState.thumbnail}
                        onPress={() => {}}
                    />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default NewTripScreen;
