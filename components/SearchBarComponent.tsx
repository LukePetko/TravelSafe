import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { SearchBar } from "react-native-ios-kit";
import { InstantSearch } from "react-instantsearch-native";
import algoliasearch from "algoliasearch";
import Hits from "./Hits";
import SearchBox from "./SearchBox";

type SearchBarProps = {
    onResultPress: () => void;
};

const SearchBarComponent = (props: SearchBarProps) => {
    const { onResultPress } = props;

    const searchClient = algoliasearch(
        "8EMUP1DEA7",
        "f59d27e868b89f234fa07f560ae3fd03",
    );

    const [text, setText] = useState("");

    useEffect(() => {
        console.log(text);
    }, [text]);

    return (
        <InstantSearch searchClient={searchClient} indexName="username">
            <SearchBox />
            <Hits onPress={onResultPress} />
        </InstantSearch>
    );
};

export default SearchBarComponent;
