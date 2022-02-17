import { View, Text } from "../components/Themed";
import React, { useEffect, useState } from "react";
import { styles } from "../styles/global";
import { useSelector } from "react-redux";
import { getUserById } from "../api/firestore";

const ProfileScreen = () => {
    const userID = useSelector(
        (state: { user: any }) => state.user.user.payload,
    );
    const [user, setUser] = useState<any>({});

    useEffect(() => {
        console.log(userID);
        getUserById(userID).then((user) => {
            setUser(user);
        });
    }, []);

    getUserById(user);

    // console.log(user);

    return (
        <View style={styles.container}>
            <Text>ProfileScreen</Text>
            <Text>{user?.username}</Text>
        </View>
    );
};

export default ProfileScreen;
