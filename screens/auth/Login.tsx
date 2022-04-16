import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { auth } from "../../Firebase";
import { login } from "../../redux/stores/user";
import { styles } from "../../styles/global";

import { View, Text } from "../../components/Themed";

import { signInWithEmailAndPassword } from "firebase/auth";
import ListInput from "../../components/ListInput";
import ListLabel from "../../components/ListLabel";
import { tintColorLight } from "../../constants/Colors";
import { Alert } from "react-native";
import { Dispatch } from "@reduxjs/toolkit";
import { storeData } from "../../async-storage";

type LoginProps = {
    navigation: any;
};

export const Login = (props: LoginProps): JSX.Element => {
    const { navigation } = props;

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const dispatch: Dispatch<any> = useDispatch<any>();

    const signIn = (): void => {
        signInWithEmailAndPassword(auth, email, password)
            .then((user) => {
                dispatch(login(user.user.uid));
                storeData("userId", user.user.uid);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                createTwoButtonAlert();
            });
    };

    const createTwoButtonAlert = (): void =>
        Alert.alert("Verification failed", "Invalid email or password", [
            {
                text: "OK",
                style: "cancel",
            },
        ]);

    return (
        <View style={styles.container}>
            <Text style={[styles.logoLarge, { marginBottom: 50 }]}>
                TravelSafe
            </Text>
            <ListInput
                value={email}
                onChangeText={(text: string): void => setEmail(text)}
                placeholder={"Enter Email"}
                keyboardType={"email-address"}
                autoCapitalize={"none"}
                autoCorrect={false}
                borderRadius={{ top: true }}
                separator={true}
            />
            <ListInput
                value={password}
                onChangeText={(text: string): void => setPassword(text)}
                placeholder={"Enter Password"}
                secureTextEntry={true}
                keyboardType={"default"}
                autoCapitalize={"none"}
                autoCorrect={false}
                style={{ marginBottom: 20 }}
                borderRadius={{ bottom: true }}
            />
            <ListLabel
                borderRadius={{ top: true }}
                separator={true}
                onPress={(): void => signIn()}
                textStyles={{ color: tintColorLight, fontWeight: "bold" }}
            >
                Log In
            </ListLabel>
            <ListLabel
                borderRadius={{ bottom: true }}
                onPress={(): void => navigation.navigate("Register")}
                textStyles={{ color: tintColorLight }}
            >
                Register
            </ListLabel>
        </View>
    );
};
