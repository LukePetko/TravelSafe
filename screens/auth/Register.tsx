import React, { useState } from "react";
import { ScrollView, Text, Pressable, View } from "../../components/Themed";
import ThemedListItem from "../../components/ListLabel";
import { styles } from "../../styles/global";
import { loginStyles } from "../../styles/login.styles";
import ListInput from "../../components/ListInput";
import { KeyboardAvoidingView } from "react-native";
import ListCalendar from "../../components/ListCalendar";

type RegisterProps = {
    navigation: any;
};

const Register = ({ navigation }: RegisterProps) => {
    const [date, setDate] = useState(new Date());

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
                <View
                    style={[
                        styles.container,
                        {
                            paddingVertical: 50,
                            height: "100%",
                        },
                    ]}
                >
                    <Text style={[styles.logoLarge, { marginBottom: 50 }]}>
                        TravelSafe
                    </Text>
                    <ListInput
                        placeholder={"Enter username"}
                        keyboardType={"default"}
                        autoCapitalize={"none"}
                        autoCorrect={false}
                        borderRadius={{ top: true }}
                        separator={true}
                    />
                    <ListInput
                        placeholder={"Enter email"}
                        keyboardType={"email-address"}
                        autoCapitalize={"none"}
                        autoCorrect={false}
                        separator={true}
                    />
                    <ListInput
                        placeholder={"Confirm email"}
                        keyboardType={"email-address"}
                        autoCapitalize={"none"}
                        autoCorrect={false}
                        borderRadius={{ bottom: true }}
                        style={{ marginBottom: 50 }}
                    />
                    <ListInput
                        placeholder={"Enter password"}
                        keyboardType={"default"}
                        secureTextEntry={true}
                        autoCapitalize={"none"}
                        autoCorrect={false}
                        borderRadius={{ top: true }}
                        separator={true}
                    />
                    <ListInput
                        placeholder={"Confirm password"}
                        keyboardType={"default"}
                        secureTextEntry={true}
                        autoCapitalize={"none"}
                        autoCorrect={false}
                        borderRadius={{ bottom: true }}
                        style={{ marginBottom: 50 }}
                    />
                    <ListCalendar
                        borderRadius={{ top: true, bottom: true }}
                        showDatePicker={true}
                        date={date}
                        setDate={(date) => setDate(date)}
                        style={{
                            marginBottom: 50,
                        }}
                    >
                        Choose a birthdate
                    </ListCalendar>

                    <Pressable style={loginStyles.button}>
                        <Text style={loginStyles.text}>Register</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default Register;
