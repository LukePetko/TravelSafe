import { Dispatch } from "@reduxjs/toolkit";
import { onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { SFSymbol } from "react-native-sfsymbols";
import { useDispatch, useSelector } from "react-redux";
import { getUserDocById } from "../../api/firestore";
import ListLabel from "../../components/ListLabel";
import {
    View,
    Text,
    ScrollView,
    KeyboardAvoidingView,
} from "../../components/Themed";
import { tintColorLight } from "../../constants/Colors";
import { logout } from "../../redux/stores/user";
import { styles } from "../../styles/global";
import { User } from "../../utils/types/user";

type SettingsModalProps = {
    navigation: any;
};

const SettingsModal = (props: SettingsModalProps) => {
    const { navigation } = props;

    const dispatch: Dispatch<any> = useDispatch<any>();
    const userId = useSelector((state: any) => state.user.user.payload);

    const [user, setUser] = useState<any>({});
    const [closeContacts, setCloseContacts] = useState<any[]>([]);

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
                    style={{ marginBottom: 20 }}
                    textStyles={{ color: tintColorLight }}
                    borderRadius={{
                        top: closeContacts.length === 0,
                        bottom: true,
                    }}
                    icon={
                        <SFSymbol
                            name="plus"
                            weight="semibold"
                            scale="large"
                            color={tintColorLight}
                            size={18}
                            resizeMode="center"
                            multicolor={false}
                            style={{
                                width: 32,
                                height: 32,
                            }}
                        />
                    }
                    onPress={() => {
                        navigation.navigate("SearchModal");
                    }}
                >
                    Add Close Contact
                </ListLabel>
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
