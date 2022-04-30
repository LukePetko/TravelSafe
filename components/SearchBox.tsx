import React from "react";
import { connectSearchBox } from "react-instantsearch-native";
import { SearchBar } from "react-native-ios-kit";

const SearchBox = connectSearchBox(({ refine, currentRefinement }) => {
    return (
        <SearchBar
            value={currentRefinement}
            onValueChange={(text: string) => refine(text)}
            withCancel
            animated
        />
    );
});

export default SearchBox;
