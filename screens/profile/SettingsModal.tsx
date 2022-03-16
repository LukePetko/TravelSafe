import { Dispatch } from "@reduxjs/toolkit";
import { onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserDocById } from "../../api/firestore";
import ListLabel from "../../components/ListLabel";
import {
    View,
    Text,
    ScrollView,
    KeyboardAvoidingView,
} from "../../components/Themed";
import { logout } from "../../redux/stores/user";
import { styles } from "../../styles/global";
import { User } from "../../utils/types/user";

const SettingsModal = () => {
    const dispatch: Dispatch<any> = useDispatch<any>();
    const userId = useSelector((state: any) => state.user.user.payload);

    const [user, setUser] = useState<any>({});

    useEffect(() => {
        const unSub = onSnapshot(getUserDocById(userId), (doc) => {
            setUser(doc.data());
        });
    }, []);

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
