import React, { useState } from "react";
import {
    ScrollView,
    Text,
    View,
    KeyboardAvoidingView,
} from "../../components/Themed";
import { styles } from "../../styles/global";
import ListInput from "../../components/ListInput";
import ListCalendar from "../../components/ListCalendar";
import { registerValidation } from "../../utils/validations";
import ListLabel from "../../components/ListLabel";
import { tintColorLight } from "../../constants/Colors";
import { auth } from "../../Firebase";
import { createUserWithEmailAndPassword, UserCredential } from "firebase/auth";
import { createUserAccount } from "../../api/firestore";
import { useDispatch } from "react-redux";
import { login } from "../../redux/stores/user";
import { Dispatch } from "@reduxjs/toolkit";
import { BasicUserInfo } from "../../utils/types/basicUserInfo";
import { storeData } from "../../async-storage";
import { uploadProfileImage } from "../../api/storage";
import { Timestamp } from "firebase/firestore";

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

const Register = (props: RegisterProps): JSX.Element => {
    const { navigation } = props;

    const [time, setTime] = useState<Date>(new Date());
    const [state, setState] = useState<RegisterState>({
        username: "",
        email: "",
        confirmEmail: "",
        password: "",
        confirmPassword: "",
        birthDate: new Date(),
    });

    const dispatch: Dispatch<any> = useDispatch<any>();

    const onChange = (key: keyof RegisterState, value: string | Date): void => {
        setState({
            ...state,
            [key]: value,
        });
    };

    const onSubmit = async (): Promise<void> => {
        const errors = registerValidation(state);
        if (errors.isValid) {
            const user: UserCredential = await createUserWithEmailAndPassword(
                auth,
                state.email,
                state.password,
            );

            fetch(
                `https://avatars.dicebear.com/api/initials/${state.username}.jpg`,
            )
                .then((res) => res.blob())
                .then(async (blob) => {
                    const response = await uploadProfileImage(
                        blob,
                        user.user.uid,
                    );

                    console.error(response);

                    const userId: string = user.user.uid;
                    const userData: BasicUserInfo = {
                        username: state.username,
                        email: state.email,
                        birthDate: Timestamp.fromDate(state.birthDate),
                        profilePicture: response,
                    };

                    const userDoc: boolean = await createUserAccount(
                        userId,
                        userData,
                    );

                    if (userDoc) {
                        dispatch(login(userId));
                        // dispatch(login(userId));
                        storeData("userId", userId);
                    }
                });
        }
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
                        onChangeText={(value: string): void =>
                            onChange("username", value)
                        }
                        placeholder={"Enter username"}
                        keyboardType={"default"}
                        autoCapitalize={"none"}
                        autoCorrect={false}
                        borderRadius={{ top: true }}
                        separator={true}
                    />
                    <ListInput
                        value={state.email}
                        onChangeText={(value: string): void =>
                            onChange("email", value)
                        }
                        placeholder={"Enter email"}
                        keyboardType={"email-address"}
                        autoCapitalize={"none"}
                        autoCorrect={false}
                        separator={true}
                    />
                    <ListInput
                        value={state.confirmEmail}
                        onChangeText={(value: string): void =>
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
                        onChangeText={(value: string): void =>
                            onChange("password", value)
                        }
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
                        onChangeText={(value: string): void =>
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
                        setDate={(value: Date): void =>
                            onChange("birthDate", value)
                        }
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
