import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { auth } from "../../Firebase";
import { login } from "../../redux/stores/user";
import { styles } from "../../styles/global";

import { View, Text, Pressable } from "../../components/Themed";

import { signInWithEmailAndPassword } from "firebase/auth";
import { loginStyles } from "../../styles/login.styles";
import ThemedTextInput from "../../components/ThemedTextInput";

export const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        console.log(email);
    }, [email]);

    const dispatch = useDispatch();

    const signIn = () => {
        signInWithEmailAndPassword(auth, email, password)
            .then((user) => {
                dispatch(login(user.user.uid));
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode);
                console.log(errorMessage);
            });
    };

    return (
        <View style={styles.container}>
            <Text style={[styles.logoLarge, { marginBottom: 50 }]}>
                TravelSafe
            </Text>
            <ThemedTextInput
                value={email}
                onChangeText={(text) => setEmail(text)}
                placeholder={"Enter Email"}
                keyboardType={"email-address"}
            />
            <ThemedTextInput
                value={password}
                onChangeText={(text) => setPassword(text)}
                placeholder={"Enter Password"}
                secureTextEntry={true}
                keyboardType={"default"}
                style={{ marginBottom: 20 }}
            />
            <Pressable style={loginStyles.button} onPress={() => signIn()}>
                <Text style={loginStyles.text}>Log In</Text>
            </Pressable>
            <Pressable style={loginStyles.button} onPress={() => signIn()}>
                <Text style={[loginStyles.text, { fontWeight: "bold" }]}>
                    Register
                </Text>
            </Pressable>
        </View>
    );
};
