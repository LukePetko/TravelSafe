import React from "react";
import { View, Text, Button } from "react-native";
import { useDispatch } from "react-redux";
import { auth } from "../../Firebase";
import { login } from "../../redux/stores/user";
import { styles } from "../../styles/global";

import { connectAuthEmulator, getAuth, signInWithEmailAndPassword } from "firebase/auth";

export const Login = () => {
    const dispatch = useDispatch();

    const signIn = () => {
        signInWithEmailAndPassword(auth, "luke.petko@gmail.com", "123456")
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
            <Text>Henlo</Text>
            <Button title="Test" onPress={() => signIn()} />
        </View>
    );
};
