import React from "react";
import { View, Text, Button } from "react-native";
import { useDispatch } from "react-redux";
import { useStoreSelector } from "../../hooks/useStoreSelector";
import { login } from "../../redux/stores/user";

export const Login = () => {
    const dispatch = useDispatch();

    return (
        <View>
            <Button onPress={() => dispatch(login("123"))} title="yes" />
            <Button onPress={() => dispatch(login("123"))} title="yes" />
            <Button onPress={() => dispatch(login("123"))} title="yes" />
            <Button onPress={() => dispatch(login("123"))} title="yes" />
        </View>
    );
};
