import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useColorScheme } from "react-native";
import Colors from "../../constants/Colors";
import { Login } from "../../screens/auth/Login";
import Register from "../../screens/auth/Register";
import { ColorSchemeEnum, LoginStackParamList } from "../../types";

const LoginStack = createNativeStackNavigator<LoginStackParamList>();

export const AuthNavigator = (): JSX.Element => {
    const colorScheme: ColorSchemeEnum = useColorScheme() as ColorSchemeEnum;

    return (
        <LoginStack.Navigator
            initialRouteName="Login"
            screenOptions={{
                gestureEnabled: true,
                headerTintColor: Colors[colorScheme].tint,
            }}
        >
            <LoginStack.Screen
                name="Login"
                component={Login}
                options={{ headerShown: false }}
            />
            <LoginStack.Screen
                name="Register"
                component={Register}
                // options={{ title: "Oops!" }}
            />
        </LoginStack.Navigator>
    );
};
