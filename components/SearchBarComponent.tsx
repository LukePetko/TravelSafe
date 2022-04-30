import React, { useState } from "react";
import { InstantSearch } from "react-instantsearch-native";
import algoliasearch from "algoliasearch";
import Hits from "./Hits";
import SearchBox from "./SearchBox";

type SearchBarProps = {
    onResultPress: (id: string) => void;
};

const SearchBarComponent = (props: SearchBarProps) => {
    const { onResultPress } = props;

    const searchClient = algoliasearch(
        "8EMUP1DEA7",
        "f59d27e868b89f234fa07f560ae3fd03",
    );

    const [text, setText] = useState("");

    return (
        <InstantSearch searchClient={searchClient} indexName="username">
            <SearchBox />
            <Hits onPress={(id: string) => onResultPress(id)} />
        </InstantSearch>
    );
};

export default SearchBarComponent;
