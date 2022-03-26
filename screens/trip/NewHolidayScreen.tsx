import { View, Text } from "react-native";
import React, { useState } from "react";
import { getUserId } from "../../redux/stores/user";
import store from "../../redux/store";
import {
    KeyboardAvoidingView,
    Pressable,
    ScrollView,
} from "../../components/Themed";
import { SFSymbol } from "react-native-sfsymbols";
import { tintColorLight } from "../../constants/Colors";
import ListInput from "../../components/ListInput";
import ListLabel from "../../components/ListLabel";
import ListCalendar from "../../components/ListCalendar";
import ProfilePicture from "../../components/ProfilePicture";
import { newHolidayValidation } from "../../utils/validations";
import { Holiday } from "../../utils/types/holiday";
import { createHoliday } from "../../api/firestore/trips";

type NewHolidayScreenProps = {
    navigation: any;
    route: any;
};

export type NewHolidayState = {
    name: string;
    description: string;
    startTime: Date;
    endTime: Date;
    thumbnail: string;
};

const NewHolidayScreen = (props: NewHolidayScreenProps) => {
    const { navigation, route } = props;

    const [tripState, setTripState] = useState<NewHolidayState>({
        name: "",
        description: "",
        startTime: new Date(),
        endTime: new Date(),
        thumbnail:
            "https://images.unsplash.com/photo-1642543492493-f57f7047be73?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    });

    const onChange = (
        key: keyof NewHolidayState,
        value: string | Date,
    ): void => {
        setTripState({
            ...tripState,
            [key]: value,
        });
    };

    const userId = getUserId(store.getState());

    const onSubmit = () => {
        console.log(newHolidayValidation(tripState));

        const holiday: Holiday = {
            userId: userId,
            ...tripState,
            status: "created",
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        console.log(createHoliday(holiday));
        navigation.goBack();
    };

    navigation.setOptions({
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
                            onChange("startTime", date);
                        }}
                        date={tripState.startTime}
                        minimumDate={new Date()}
                    >
                        Start Date
                    </ListCalendar>
                    <ListCalendar
                        borderRadius={{ bottom: true }}
                        showDatePicker={true}
                        setDate={(date: Date): void => {
                            onChange("endTime", date);
                        }}
                        date={tripState.endTime}
                        minimumDate={tripState.startTime}
                    >
                        End Date
                    </ListCalendar>

                    <ListLabel
                        showChevron={true}
                        borderRadius={{ top: true, bottom: true }}
                        style={{ marginTop: 20 }}
                    >
                        Destination
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

export default NewHolidayScreen;
