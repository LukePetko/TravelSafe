import React, { useEffect, useState } from "react";
import { getUserNotifications } from "../api/firestore";
import { Pressable, Text, View } from "../components/Themed";
import { styles } from "../styles/global";
import { getUserId } from "../redux/stores/user";
import Notification from "../components/Notification";
import store from "../redux/store";
import { acceptNotification } from "../api/firestore/notifications";
import { FlatList } from "react-native";

const NotificationScreen = (): JSX.Element => {
    const userId = getUserId(store.getState());
    const [notifications, setNotifications] = useState<any[] | null>([]);

    useEffect(() => {
        getUserNotifications(userId).then((notifications) => {
            if (notifications) {
                setNotifications(
                    notifications?.sort((a, b) => b.createdAt - a.createdAt),
                );
            }
        });
    }, []);

    return (
        <View style={{ flex: 1 }}>
            <FlatList
                ListEmptyComponent={
                    <View style={styles.container}>
                        <Text style={{ fontWeight: "600", marginTop: 50 }}>
                            No notifications
                        </Text>
                    </View>
                }
                data={notifications}
                renderItem={({ item }) => (
                    <Pressable
                        key={`${item.senderId}-${item.createdAt}`}
                        styles={{ backgroundColor: "transparent" }}
                    >
                        <Notification
                            type={item.type}
                            senderId={item.senderId}
                            username={item.senderUsername}
                            profilePicture={item.senderProfilePicture}
                            createdAt={item.createdAt}
                            onAccept={() => {
                                acceptNotification(
                                    item.senderId,
                                    item.receiverId,
                                    item.time || null,
                                    item.postId || null,
                                );

                                setNotifications(
                                    (notifications) =>
                                        notifications &&
                                        notifications.filter(
                                            (n) =>
                                                n.senderId !== item.senderId &&
                                                (!!n.time
                                                    ? n.time !== item.time
                                                    : true) &&
                                                (!!n.postId
                                                    ? n.postId !== item.postId
                                                    : true),
                                        ),
                                );
                            }}
                            onDecline={() => {}}
                        />
                    </Pressable>
                )}
                keyExtractor={(item) =>
                    `${item.senderId}${item.receiverId}${item.time}${item.postId}`
                }
            />
        </View>
    );
};

export default NotificationScreen;
