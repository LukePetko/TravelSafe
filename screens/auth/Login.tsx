import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { auth } from "../../Firebase";
import { login } from "../../redux/stores/user";
import { styles } from "../../styles/global";

import { View, Text, Pressable } from "../../components/Themed";

import { signInWithEmailAndPassword } from "firebase/auth";
import { loginStyles } from "../../styles/login.styles";
import ListInput from "../../components/ListInput";
import ListLabel from "../../components/ListLabel";
import { Feather } from "@expo/vector-icons";
import Colors, { tintColorLight } from "../../constants/Colors";

type LoginProps = {
    navigation: any;
};

export const Login = ({ navigation }: LoginProps) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const dispatch = useDispatch();

    const signIn = () => {
        console.log("sign in");
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
