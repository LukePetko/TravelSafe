import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../../../screens/home/HomeScreen";
import { HomeStackParamList } from "../../../types";

const HomeStack = createNativeStackNavigator<HomeStackParamList>();

export const HomeStackNavigator = (): JSX.Element => {
    return (
        <HomeStack.Navigator>
            <HomeStack.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    headerShown: false,
                }}
            />
        </HomeStack.Navigator>
    );
};
