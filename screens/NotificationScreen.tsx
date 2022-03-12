import { useEffect } from "react";
import { getUserNotifications } from "../api/firestore";
import { Text, View } from "../components/Themed";
import { styles } from "../styles/global";
import { useSelector } from "react-redux";
import { getUserId } from "../redux/stores/user";
import store from "../redux/store";

const NotificationScreen = (): JSX.Element => {
    const userId = getUserId(store.getState());

    useEffect(() => {
        getUserNotifications(userId).then(console.log);
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Modal</Text>
        </View>
    );
};

export default NotificationScreen;
