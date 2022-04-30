import React from "react";
import SearchBarComponent from "../../components/SearchBarComponent";
import { View } from "../../components/Themed";

type SearchScreenProps = {
    navigation: any;
};

const SearchScreen = (props: SearchScreenProps) => {
    const { navigation } = props;
    return (
        <View
            style={{
                flex: 1,
            }}
        >
            <SearchBarComponent
                onResultPress={(id?: string) =>
                    navigation.navigate("ProfileScreen", { id: id ?? "" })
                }
            />
        </View>
    );
};

export default SearchScreen;
