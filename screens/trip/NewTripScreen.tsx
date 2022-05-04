import { Timestamp } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import { createTrip, getUserHoliday } from "../../api/firestore";
import { removeThumbnail, uploadThumbnail } from "../../api/storage";
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
import { tintColorLight } from "../../constants/Colors";
import store from "../../redux/store";
import { getUserId } from "../../redux/stores/user";
import { openImageDialog } from "../../utils/imagePicker";
import { Holiday } from "../../utils/types/holiday";
import { Trip } from "../../utils/types/trip";
import { newTripValidation } from "../../utils/validations";
import { v4 } from "uuid";

type NewTripScreenProps = {
    navigation: any;
    route: any;
};

export type NewTripState = {
    name: string;
    description: string;
    holiday: Holiday | null;
    startTime: Timestamp;
    endTime: Timestamp;
    thumbnail: string;
};

const NewTripScreen = (props: NewTripScreenProps) => {
    const { navigation, route } = props;

    const [tripState, setTripState] = useState<NewTripState>({
        name: "",
        description: "",
        holiday: null,
        startTime: Timestamp.fromDate(new Date()),
        endTime: Timestamp.fromDate(new Date()),
        thumbnail:
            "https://images.unsplash.com/photo-1642543492493-f57f7047be73?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    });

    const [holidays, setHolidays] = useState<Holiday[]>([]);
    const [showHoliday, setShowHoliday] = useState<boolean>(false);
    const [isUploading, setIsUploading] = useState<boolean>(false);

    const onChange = (
        key: keyof NewTripState,
        value: string | Timestamp | Holiday | null,
    ): void => {
        setTripState((currentValue) => ({
            ...currentValue,
            [key]: value,
        }));
    };

    const userId = getUserId(store.getState());

    const colorScheme = useColorScheme();

    useEffect(() => {
        getUserHoliday(userId).then((holidays) => {
            setHolidays(holidays);
        });
    }, []);

    useEffect(() => {
        navigation.setOptions({
            headerTitle: "New Trip",
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

    const onSubmit = () => {
        newTripValidation(tripState);

        const trip: Trip & { holiday?: Holiday | null } = {
            userId: userId,
            ...tripState,
            holidayId: tripState.holiday?.holidayId || null,
            status: "created",
            createdAt: Timestamp.fromDate(new Date()),
            updatedAt: Timestamp.fromDate(new Date()),
        };

        delete trip.holiday;

        createTrip(trip);
        navigation.goBack();
    };

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
                        separator={holidays.length > 0}
                        borderRadius={{
                            top: true,
                            bottom: holidays.length === 0,
                        }}
                    />
                    {holidays.length > 0 && (
                        <ListLabel
                            showChevron={true}
                            borderRadius={{ bottom: !showHoliday }}
                            separator={showHoliday}
                            rotateChevron={showHoliday}
                            onPress={() => setShowHoliday(!showHoliday)}
                            fieldValue={tripState.holiday?.name}
                        >
                            Holiday
                        </ListLabel>
                    )}

                    {showHoliday && (
                        <>
                            <ListLabel
                                borderRadius={{
                                    bottom: true,
                                }}
                                separator={true}
                                onPress={() => {
                                    onChange("holiday", null);
                                    setShowHoliday(false);
                                }}
                            >
                                No Holiday
                            </ListLabel>

                            {holidays.map((holiday, index) => (
                                <ListLabel
                                    key={holiday.id!}
                                    borderRadius={{
                                        bottom: index === holidays.length - 1,
                                    }}
                                    separator={index !== holidays.length - 1}
                                    onPress={() => {
                                        onChange("holiday", holiday);
                                        setShowHoliday(false);
                                    }}
                                >
                                    {holiday.name}
                                </ListLabel>
                            ))}
                        </>
                    )}

                    <ListCalendar
                        style={{ marginTop: 20 }}
                        borderRadius={{ top: true }}
                        separator={true}
                        showDatePicker={true}
                        showTimePicker={true}
                        setDate={(date: Date): void => {
                            onChange("startTime", Timestamp.fromDate(date));
                        }}
                        setTime={(time: Date): void => {
                            onChange("startTime", Timestamp.fromDate(time));
                        }}
                        date={tripState.startTime.toDate()}
                        time={tripState.startTime.toDate()}
                        minimumDate={new Date()}
                    >
                        Start Time
                    </ListCalendar>
                    <ListCalendar
                        borderRadius={{ bottom: true }}
                        showDatePicker={true}
                        showTimePicker={true}
                        setDate={(date: Date): void => {
                            onChange("endTime", Timestamp.fromDate(date));
                        }}
                        setTime={(time: Date): void => {
                            onChange("endTime", Timestamp.fromDate(time));
                        }}
                        date={tripState.endTime.toDate()}
                        time={tripState.endTime.toDate()}
                        minimumDate={tripState.startTime.toDate()}
                    >
                        End Time
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
                        isLoading={isUploading}
                        onPress={() =>
                            openImageDialog(
                                navigation,
                                async (blob) => {
                                    setIsUploading(true);
                                    if (
                                        tripState.thumbnail !==
                                        "https://images.unsplash.com/photo-1642543492493-f57f7047be73?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
                                    )
                                        removeThumbnail(tripState.thumbnail);
                                    const url = await uploadThumbnail(
                                        blob,
                                        v4(),
                                        userId,
                                    );
                                    onChange("thumbnail", url);
                                    setIsUploading(false);
                                },
                                colorScheme as "light" | "dark" | undefined,
                            )
                        }
                    />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default NewTripScreen;
