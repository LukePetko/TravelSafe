import React, { useEffect, useState } from "react";
import { ScrollView, Text, Pressable, View } from "../../components/Themed";
import ThemedListItem from "../../components/ListLabel";
import { styles } from "../../styles/global";
import { loginStyles } from "../../styles/login.styles";
import ListInput from "../../components/ListInput";
import { KeyboardAvoidingView } from "react-native";
import ListCalendar from "../../components/ListCalendar";
import { registerValidation } from "../../utils/validations";
import ListLabel from "../../components/ListLabel";
import { tintColorLight } from "../../constants/Colors";
import { auth } from "../../Firebase";
import { createUserWithEmailAndPassword, UserCredential } from "firebase/auth";
import { createUserAccount } from "../../api/firestore";
import { useDispatch } from "react-redux";
import { login } from "../../redux/stores/user";

type RegisterProps = {
    navigation: any;
};

export type RegisterState = {
    username: string;
    email: string;
    confirmEmail: string;
    password: string;
    confirmPassword: string;
    birthDate: Date;
};

const Register = ({ navigation }: RegisterProps) => {
    const [time, setTime] = useState(new Date());
    const [state, setState] = useState<RegisterState>({
        username: "",
        email: "",
        confirmEmail: "",
        password: "",
        confirmPassword: "",
        birthDate: new Date(),
    });

    const dispatch = useDispatch();

    const onChange = (key: keyof RegisterState, value: string | Date) => {
        setState({
            ...state,
            [key]: value,
        });
    };

    const onSubmit = async () => {
        const errors = registerValidation(state);
        if (errors.isValid) {
            const user: UserCredential = await createUserWithEmailAndPassword(
                auth,
                state.email,
                state.password,
            );

            const userId = user.user.uid;
            const userData = {
                username: state.username,
                email: state.email,
                birthDate: state.birthDate,
            };

            const userDoc = await createUserAccount(userId, userData);

            if (userDoc) {
                dispatch(login(userId));
            }

            console.log(user.providerId);
        }

        console.log(errors);
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
                        value={state.username}
                        onChangeText={(value) => onChange("username", value)}
                        placeholder={"Enter username"}
                        keyboardType={"default"}
                        autoCapitalize={"none"}
                        autoCorrect={false}
                        borderRadius={{ top: true }}
                        separator={true}
                    />
                    <ListInput
                        value={state.email}
                        onChangeText={(value) => onChange("email", value)}
                        placeholder={"Enter email"}
                        keyboardType={"email-address"}
                        autoCapitalize={"none"}
                        autoCorrect={false}
                        separator={true}
                    />
                    <ListInput
                        value={state.confirmEmail}
                        onChangeText={(value) =>
                            onChange("confirmEmail", value)
                        }
                        placeholder={"Confirm email"}
                        keyboardType={"email-address"}
                        autoCapitalize={"none"}
                        autoCorrect={false}
                        borderRadius={{ bottom: true }}
                        style={{ marginBottom: 50 }}
                    />
                    <ListInput
                        value={state.password}
                        onChangeText={(value) => onChange("password", value)}
                        placeholder={"Enter password"}
                        keyboardType={"default"}
                        secureTextEntry={true}
                        autoCapitalize={"none"}
                        autoCorrect={false}
                        borderRadius={{ top: true }}
                        separator={true}
                    />
                    <ListInput
                        value={state.confirmPassword}
                        onChangeText={(value) =>
                            onChange("confirmPassword", value)
                        }
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
                        // showTimePicker={true}
                        date={state.birthDate}
                        setDate={(value) => onChange("birthDate", value)}
                        // time={time}
                        // setTime={(value) => setTime(value)}
                        style={{
                            marginBottom: 50,
                        }}
                    >
                        Choose a birthdate
                    </ListCalendar>

                    <ListLabel
                        borderRadius={{ top: true, bottom: true }}
                        onPress={onSubmit}
                        textStyles={{
                            color: tintColorLight,
                        }}
                    >
                        Register
                    </ListLabel>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default Register;
