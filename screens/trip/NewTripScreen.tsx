import React, { useEffect, useState } from "react";
import { SFSymbol } from "react-native-sfsymbols";
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

type NewTripScreenProps = {
    navigation: any;
    route: any;
};

const NewTripScreen = (props: NewTripScreenProps) => {
    const { navigation, route } = props;

    const [tripName, setTripName] = useState("");
    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());
    const [desctiption, setDescription] = useState("");
    const [thumbnail, setThumbnail] = useState(
        "https://images.unsplash.com/photo-1642543492493-f57f7047be73?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    );

    const userId = getUserId(store.getState());

    const onSubmit = () => {
        const trip: Trip = {
            userId: userId,
            name: tripName,
            startTime: startTime,
            endTime: endTime,
            description: desctiption,
            thumbnail: thumbnail,
            status: "created",
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        console.log(trip);
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
                        value={tripName}
                        onChangeText={(value: string): void => {
                            setTripName(value);
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
                            setStartTime(date);
                        }}
                        setTime={(time: Date): void => {
                            setStartTime(time);
                        }}
                        date={startTime}
                        time={startTime}
                        minimumDate={new Date()}
                    >
                        Start Time
                    </ListCalendar>
                    <ListCalendar
                        borderRadius={{ bottom: true }}
                        showDatePicker={true}
                        showTimePicker={true}
                        setDate={(date: Date): void => {
                            setEndTime(date);
                        }}
                        setTime={(time: Date): void => {
                            setEndTime(time);
                        }}
                        date={endTime}
                        time={endTime}
                        minimumDate={startTime}
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
                        value={desctiption}
                        onChangeText={(value: string): void => {
                            setDescription(value);
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
                    <ProfilePicture photoURL={thumbnail} onPress={() => {}} />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default NewTripScreen;
