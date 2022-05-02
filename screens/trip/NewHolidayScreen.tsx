import { View, Text, useColorScheme } from "react-native";
import React, { useEffect, useState } from "react";
import { getUserId } from "../../redux/stores/user";
import store from "../../redux/store";
import {
    KeyboardAvoidingView,
    Pressable,
    ScrollView,
} from "../../components/Themed";
import { tintColorLight } from "../../constants/Colors";
import ListInput from "../../components/ListInput";
import ListLabel from "../../components/ListLabel";
import ListCalendar from "../../components/ListCalendar";
import ProfilePicture from "../../components/ProfilePicture";
import { newHolidayValidation } from "../../utils/validations";
import { Holiday } from "../../utils/types/holiday";
import { createHoliday } from "../../api/firestore/trips";
import { Timestamp } from "firebase/firestore";

type NewHolidayScreenProps = {
    navigation: any;
    route: any;
};

export type NewHolidayState = {
    name: string;
    description: string;
    startTime: Timestamp;
    endTime: Timestamp;
    thumbnail: string;
};

const NewHolidayScreen = (props: NewHolidayScreenProps) => {
    const { navigation, route } = props;

    const [tripState, setTripState] = useState<NewHolidayState>({
        name: "",
        description: "",
        startTime: Timestamp.fromDate(new Date()),
        endTime: Timestamp.fromDate(new Date()),
        thumbnail:
            "https://images.unsplash.com/photo-1642543492493-f57f7047be73?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    });

    const onChange = (
        key: keyof NewHolidayState,
        value: string | Timestamp,
    ): void => {
        setTripState({
            ...tripState,
            [key]: value,
        });
    };

    const userId = getUserId(store.getState());

    const colorScheme = useColorScheme();

    const onSubmit = () => {
        newHolidayValidation(tripState);

        const holiday: Holiday = {
            userId: userId,
            ...tripState,
            status: "created",
            createdAt: Timestamp.fromDate(new Date()),
            updatedAt: Timestamp.fromDate(new Date()),
        };

        createHoliday(holiday);
        navigation.goBack();
    };

    useEffect(() => {
        navigation.setOptions({
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
            headerTintColor: tintColorLight,
            headerTitleStyle: {
                color: colorScheme === "dark" ? "#fff" : "#000",
            },
        });
    }, [tripState]);

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
                    New Holiday
                </Text>
                <View style={{ alignItems: "center", marginTop: 20 }}>
                    <ListInput
                        value={tripState.name}
                        onChangeText={(value: string): void => {
                            onChange("name", value);
                        }}
                        placeholder={"Enter holiday name"}
                        borderRadius={{ top: true, bottom: true }}
                    />

                    <ListCalendar
                        style={{ marginTop: 20 }}
                        borderRadius={{ top: true }}
                        separator={true}
                        showDatePicker={true}
                        setDate={(date: Date): void => {
                            onChange("startTime", Timestamp.fromDate(date));
                        }}
                        date={tripState.startTime.toDate()}
                        minimumDate={new Date()}
                    >
                        Start Date
                    </ListCalendar>
                    <ListCalendar
                        borderRadius={{ bottom: true }}
                        showDatePicker={true}
                        setDate={(date: Date): void => {
                            onChange("endTime", Timestamp.fromDate(date));
                        }}
                        date={tripState.endTime.toDate()}
                        minimumDate={tripState.startTime.toDate()}
                    >
                        End Date
                    </ListCalendar>

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

export default NewHolidayScreen;
