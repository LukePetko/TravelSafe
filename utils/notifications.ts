import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

export async function sendPushNotification(
    expoPushTokens: string[],
    title: string,
    body: string,
) {
    if (expoPushTokens.length === 0) return;
    const message = {
        to: expoPushTokens,
        sound: "default",
        title,
        body,
    };

    await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Accept-encoding": "gzip, deflate",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
    });
}

export async function registerForPushNotificationsAsync(): Promise<string> {
    let token;

    const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }
    if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return "";
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;

    return token || "";
}

export const inactiveLocalNotification = () => {
    const schedulingOptions = {
        content: {
            title: "You have been inactive for a while",
            body: "Is everything ok?",
            sound: true,
        },
        trigger: {
            seconds: 1,
        },
    };
    Notifications.scheduleNotificationAsync(schedulingOptions);
};
