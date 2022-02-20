import { StyleSheet, TouchableOpacity } from "react-native";

import { Text, View } from "../components/Themed";
import { styles } from "../styles/global";
import { RootStackScreenProps } from "../types";

type NotFoundScreenProps = {
    navigation: any;
};

const NotFoundScreen = (props: NotFoundScreenProps): JSX.Element => {
    const { navigation } = props;
    return (
        <View style={styles.container}>
            <Text style={styles.title}>This screen doesn't exist.</Text>
            <TouchableOpacity
                onPress={() => navigation.replace("Root")}
                style={styles.link}
            >
                <Text style={styles.linkText}>Go to home screen!</Text>
            </TouchableOpacity>
        </View>
    );
};

export default NotFoundScreen;
