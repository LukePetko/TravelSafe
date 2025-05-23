import { Dispatch } from "@reduxjs/toolkit";
import React, { useEffect, useState } from "react";
import { Image } from "react-native";
import { SFSymbol } from "react-native-sfsymbols";
import { connect, useDispatch } from "react-redux";
import {
    getSentNotifications,
    removeNotificationId,
} from "../../api/firestore";
import { removeData } from "../../async-storage";
import ListLabel from "../../components/ListLabel";
import { ScrollView, KeyboardAvoidingView } from "../../components/Themed";
import { tintColorLight } from "../../constants/Colors";
import store from "../../redux/store";
import {
    getNotificationId,
    getUserId,
    logout,
    resetNotificationId,
} from "../../redux/stores/user";
import { styles } from "../../styles/global";

type SettingsModalProps = {
    navigation: any;
    userId: string;
};

const mapStateToProps = (state: any) => ({
    userId: getUserId(state),
});

const SettingsModal = (props: SettingsModalProps) => {
    const { navigation, userId } = props;

    const dispatch: Dispatch<any> = useDispatch<any>();

    const [user, setUser] = useState<any>({});
    const [closeContacts, setCloseContacts] = useState<any[]>([]);
    const [pendingContacts, setPendingContacts] = useState<any[]>([]);

    useEffect(() => {
        const user = store.getState().user.user.payload;
        setUser(user);

        setCloseContacts([...new Set(user.closeContacts)]);

        getSentNotifications(userId).then((data) => {
            data?.map((el) => {
                if (el.type !== 1) return;
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
                            scale="medium"
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
                        (async () => {
                            await removeData("userId");
                            removeNotificationId(
                                getUserId(store.getState()),
                                getNotificationId(store.getState()),
                            );
                            dispatch(resetNotificationId());
                            dispatch(logout());
                        })();
                    }}
                >
                    Logout
                </ListLabel>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default connect(mapStateToProps)(SettingsModal);
