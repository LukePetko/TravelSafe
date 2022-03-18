import { Dispatch } from "@reduxjs/toolkit";
import { onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Image } from "react-native";
import { SFSymbol } from "react-native-sfsymbols";
import { useDispatch, useSelector } from "react-redux";
import { getSentNotifications, getUserDocById } from "../../api/firestore";
import { removeData, storeData } from "../../async-storage";
import ListLabel from "../../components/ListLabel";
import {
    View,
    Text,
    ScrollView,
    KeyboardAvoidingView,
} from "../../components/Themed";
import { tintColorLight } from "../../constants/Colors";
import { useStoreSelector } from "../../hooks/useStoreSelector";
import store from "../../redux/store";
import { getUser, logout } from "../../redux/stores/user";
import { styles } from "../../styles/global";
import { User } from "../../utils/types/user";

type SettingsModalProps = {
    navigation: any;
};

const SettingsModal = (props: SettingsModalProps) => {
    const { navigation } = props;

    const dispatch: Dispatch<any> = useDispatch<any>();
    const userId = useSelector((state: any) => state.user.userId.payload);

    const [user, setUser] = useState<any>({});
    const [closeContacts, setCloseContacts] = useState<any[]>([]);
    const [pendingContacts, setPendingContacts] = useState<any[]>([]);

    useEffect(() => {
        const user = store.getState().user.user.payload;
        setUser(user);

        setCloseContacts([...new Set(user.closeContacts)]);

        getSentNotifications(userId).then((data) => {
            data?.map((el) => {
                const contact = {
                    id: el.receiverId,
                    username: el.receiverUsername,
                    profilePicture: el.receiverProfilePicture,
                };

                if (
                    pendingContacts.filter((c) => c.id === contact.id)
                        .length === 0
                ) {
                    setPendingContacts([...pendingContacts, contact]);
                }
            });
        });

        setPendingContacts([...new Set(pendingContacts)]);
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
                {closeContacts.map((contact: any, index: number) => (
                    <ListLabel
                        key={index}
                        separator={true}
                        borderRadius={{ top: index === 0 }}
                        icon={
                            <Image
                                source={{
                                    uri:
                                        contact.profilePicture ||
                                        "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg",
                                }}
                                style={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: 25,
                                    borderColor: "white",
                                    borderWidth: 2,
                                }}
                            />
                        }
                        showChevron={true}
                    >
                        {contact.username}{" "}
                        {contact.type === "pending" && " - Pending"}
                    </ListLabel>
                ))}
                {pendingContacts.map((contact: any, index: number) => (
                    <ListLabel
                        key={index}
                        separator={true}
                        borderRadius={{
                            top: index === 0 && closeContacts.length === 0,
                        }}
                        icon={
                            <Image
                                source={{
                                    uri:
                                        contact.profilePicture ||
                                        "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg",
                                }}
                                style={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: 25,
                                    borderColor: "white",
                                    borderWidth: 2,
                                }}
                            />
                        }
                        showChevron={true}
                    >
                        {contact.username} - Pending
                    </ListLabel>
                ))}
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
                    onPress={() => {
                        dispatch(logout());
                        removeData("userId");
                    }}
                >
                    Logout
                </ListLabel>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default SettingsModal;
