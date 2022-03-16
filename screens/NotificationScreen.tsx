import React, { useEffect, useState } from "react";
import { getUserNotifications } from "../api/firestore";
import { Pressable, Text, View } from "../components/Themed";
import { styles } from "../styles/global";
import { getUserId } from "../redux/stores/user";
import Notification from "../components/Notification";
import store from "../redux/store";
import { acceptNotification } from "../api/firestore/notifications";

const NotificationScreen = (): JSX.Element => {
    const userId = getUserId(store.getState());
    const [notifications, setNotifications] = useState<any[] | null>([]);

    useEffect(() => {
        getUserNotifications(userId).then(setNotifications);
        console.log(notifications);
    }, []);

    return (
        <View>
            {notifications?.length === 0 && (
                <Text
                    style={{ textAlign: "center", padding: 25, fontSize: 24 }}
                >
                    No notifications
                </Text>
            )}
            {notifications?.map((notification) => (
                <Pressable
                    key={notification.senderId}
                    styles={{ backgroundColor: "transparent" }}
                >
                    <Notification
                        type={notification.type}
                        senderId={notification.senderId}
                        username={notification.senderUsername}
                        profilePicture={notification.senderProfilePicture}
                        createdAt={notification.createdAt}
                        onAccept={() => {
                            acceptNotification(
                                notification.senderId,
                                notification.receiverId,
                            );

                            setNotifications(
                                (notifications) =>
                                    notifications &&
                                    notifications.filter(
                                        (n) =>
                                            n.senderId !==
                                            notification.senderId,
                                    ),
                            );
                        }}
                        onDecline={() => {}}
                    />
                </Pressable>
            ))}
        </View>
    );
};

export default NotificationScreen;
