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
import ListCalendar from "../../components/ListCalendar";
import { Alert } from "react-native";
import CameraModule from "../../components/CameraModule";

type LoginProps = {
    navigation: any;
};

export const Login = ({ navigation }: LoginProps) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

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
                createTwoButtonAlert();
            });
    };

    const createTwoButtonAlert = () =>
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
                onChangeText={(text: string) => setEmail(text)}
                placeholder={"Enter Email"}
                keyboardType={"email-address"}
                autoCapitalize={"none"}
                autoCorrect={false}
                borderRadius={{ top: true }}
                separator={true}
            />
            <ListInput
                value={password}
                onChangeText={(text: string) => setPassword(text)}
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
                onPress={() => signIn()}
                textStyles={{ color: tintColorLight, fontWeight: "bold" }}
            >
                Log In
            </ListLabel>
            <ListLabel
                borderRadius={{ bottom: true }}
                onPress={() => navigation.navigate("Register")}
                textStyles={{ color: tintColorLight }}
            >
                Register
            </ListLabel>
        </View>
    );
};
