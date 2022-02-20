import { Dispatch } from "@reduxjs/toolkit";
import React from "react";
import { useDispatch } from "react-redux";
import ListLabel from "../../components/ListLabel";
import {
    View,
    Text,
    ScrollView,
    KeyboardAvoidingView,
} from "../../components/Themed";
import { logout } from "../../redux/stores/user";
import { styles } from "../../styles/global";

const SettingsModal = () => {
    const dispatch: Dispatch<any> = useDispatch<any>();

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
            <ScrollView style={styles.container}>
                <ListLabel
                    borderRadius={{ top: true, bottom: true }}
                    textStyles={{ color: "red" }}
                    onPress={() => dispatch(logout())}
                >
                    Logout
                </ListLabel>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default SettingsModal;
