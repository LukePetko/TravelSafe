import { Timestamp } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Button, useColorScheme } from "react-native";
import { getHolidayTrips, updateHoliday } from "../../api/firestore/trips";
import ListCalendar from "../../components/ListCalendar";
import ListInput from "../../components/ListInput";
import ListLabel from "../../components/ListLabel";
import ProfilePicture from "../../components/ProfilePicture";
import {
    KeyboardAvoidingView,
    ScrollView,
    View,
    Text,
} from "../../components/Themed";
import { tintColorLight } from "../../constants/Colors";
import store from "../../redux/store";
import { getUserId } from "../../redux/stores/user";
import { Holiday } from "../../utils/types/holiday";
import { Trip } from "../../utils/types/trip";

type PastHolidayDetailScreenProps = {
    navigation: any;
    route: any;
};

const PastHolidayDetailScreen = (props: PastHolidayDetailScreenProps) => {
    const { navigation, route } = props;

    const [holiday, setHoliday] = useState<Holiday>(route.params.holiday);
    const [trips, setTrips] = useState<Trip[]>([]);

    const colorScheme = useColorScheme();

    const onChange = (
        key: keyof Holiday,
        value: string | Timestamp | null,
    ): void => {
        setHoliday({
            ...holiday,
            [key]: value,
        });
    };

    const onSave = async (): Promise<void> => {
        console.log(holiday);
        await updateHoliday(holiday);
        navigation.goBack();
    };

    navigation.setOptions({
        title: holiday.name,
        headerTintColor: tintColorLight,
        headerTitleStyle: { color: colorScheme === "dark" ? "#fff" : "#000" },
        headerRight: () => (
            <Button
                title="Save"
                color={tintColorLight}
                onPress={() => onSave()}
            />
        ),
    });

    useEffect(() => {
        getHolidayTrips(getUserId(store.getState()), holiday.holidayId!).then(
            (trips) => {
                setTrips(trips);
            },
        );
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
                    Holiday detail
                </Text>
                <View style={{ alignItems: "center", marginTop: 20 }}>
                    <ListInput
                        value={holiday?.name}
                        onChangeText={(value: string): void => {
                            onChange("name", value);
                        }}
                        placeholder={"Enter trip name"}
                        borderRadius={{
                            top: true,
                            bottom: true,
                        }}
                    />

                    {holiday?.startTime && (
                        <ListCalendar
                            style={{ marginTop: 20 }}
                            borderRadius={{ top: true }}
                            separator={true}
                            showDatePicker={true}
                            setDate={(date: Date): void => {
                                onChange("startTime", Timestamp.fromDate(date));
                            }}
                            date={holiday?.startTime.toDate()}
                            minimumDate={new Date()}
                        >
                            Start Time
                        </ListCalendar>
                    )}
                    {holiday?.endTime && (
                        <ListCalendar
                            borderRadius={{ bottom: true }}
                            showDatePicker={true}
                            setDate={(date: Date): void => {
                                onChange("endTime", Timestamp.fromDate(date));
                            }}
                            date={holiday?.endTime.toDate()}
                            minimumDate={holiday?.startTime.toDate()}
                        >
                            End Time
                        </ListCalendar>
                    )}

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
                        value={holiday?.description}
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
                            fontSize: 24,
                            padding: 10,
                        }}
                    >
                        Thumbnail
                    </Text>
                    <ProfilePicture
                        photoURL={holiday?.thumbnail!}
                        onPress={() => {}}
                    />
                    {trips.length > 0 && (
                        <Text
                            style={{
                                fontWeight: "bold",
                                fontSize: 32,
                                padding: 10,
                                marginTop: 20,
                                alignSelf: "flex-start",
                            }}
                        >
                            Holiday Trips
                        </Text>
                    )}

                    {trips.map((trip) => (
                        <ListLabel
                            key={trip.tripId}
                            showChevron={true}
                            borderRadius={{ top: true }}
                            separator={true}
                        >
                            {trip.name}
                        </ListLabel>
                    ))}
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default PastHolidayDetailScreen;
