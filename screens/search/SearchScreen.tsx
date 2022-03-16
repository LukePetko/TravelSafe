import { View, Text } from "react-native";
import React from "react";
import SearchBarComponent from "../../components/SearchBarComponent";

type SearchScreenProps = {
    navigation: any;
};

const SearchScreen = (props: SearchScreenProps) => {
    const { navigation } = props;
    return (
        <View>
            <SearchBarComponent
                onResultPress={(id: string) =>
                    navigation.navigate("ProfileScreen", { id })
                }
            />
        </View>
    );
};

export default SearchScreen;
