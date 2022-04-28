import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SearchScreen from "../../../screens/search/SearchScreen";
import { SearchStackParamList } from "../../../types";

const SearchStack = createNativeStackNavigator<SearchStackParamList>();

export const SearchStackNavigator = (): JSX.Element => {
    return (
        <SearchStack.Navigator>
            <SearchStack.Screen
                name="Search"
                component={SearchScreen}
                options={{
                    headerShown: true,
                }}
            />
        </SearchStack.Navigator>
    );
};
