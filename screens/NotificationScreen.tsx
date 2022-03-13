import React, { useEffect, useState } from "react";
import { getUserNotifications } from "../api/firestore";
import { Pressable, Text, View } from "../components/Themed";
import { styles } from "../styles/global";
import { getUserId } from "../redux/stores/user";
import Notification from "../components/Notification";
import store from "../redux/store";

const NotificationScreen = (): JSX.Element => {
    const userId = getUserId(store.getState());
    const [notifications, setNotifications] = useState<any[] | null>([]);

    useEffect(() => {
        getUserNotifications(userId).then(setNotifications);
        console.log(notifications);
    }, []);

    return (
        <View>
            <Text
                style={{
                    fontWeight: "bold",
                    fontSize: 32,
                    padding: 10,
                }}
            >
                Notifications
            </Text>
            {notifications?.map((notification) => (
                <Pressable
                    key={notification.senderId}
                    styles={{ backgroundColor: "transparent" }}
                >
                    <Notification
                        type={notification.type}
                        id={notification.senderId}
                        username={notification.senderUsername}
                        profilePicture={notification.senderProfilePicture}
                        createdAt={notification.createdAt}
                        onAccept={() => {}}
                        onDecline={() => {}}
                    />
                </Pressable>
            ))}
        </View>
    );
};

export default NotificationScreen;
