import React from "react";
import ListCalendar from "../../components/ListCalendar";
import ListInput from "../../components/ListInput";
import ListLabel from "../../components/ListLabel";
import {
    View,
    Text,
    KeyboardAvoidingView,
    ScrollView,
} from "../../components/Themed";

const NewTripScreen = () => {
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
                        value={""}
                        onChangeText={(value: string): void => {}}
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
                    >
                        Start Time
                    </ListCalendar>
                    <ListCalendar
                        borderRadius={{ bottom: true }}
                        showDatePicker={true}
                        showTimePicker={true}
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
                        borderRadius={{ top: true }}
                        separator={true}
                    >
                        End Place
                    </ListLabel>

                    <ListInput
                        value={""}
                        onChangeText={(value: string): void => {}}
                        placeholder={"Enter Description"}
                        borderRadius={{ top: true, bottom: true }}
                        style={{ marginTop: 20 }}
                    />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default NewTripScreen;
