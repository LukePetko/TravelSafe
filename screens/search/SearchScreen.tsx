import { View, Text } from "react-native";
import React from "react";
import SearchBarComponent from "../../components/SearchBarComponent";

type SearchScreenProps = {
    navigation: any;
};

const SearchScreen = () => {
    return (
        <View>
            <SearchBarComponent onResultPress={console.log} />
        </View>
    );
};

export default SearchScreen;
