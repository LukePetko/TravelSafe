import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { createCloseContactNotification } from "../../api/firestore";
import SearchBarComponent from "../../components/SearchBarComponent";
import { View } from "../../components/Themed";

type SearchModalProps = {
    navigation: any;
};

const SearchModal = (props: SearchModalProps) => {
    const { navigation } = props;
    const userId = useSelector((state: any) => state.user.user.payload);

    return (
        <View>
            <SearchBarComponent
                onResultPress={(id: string) => {
                    createCloseContactNotification(userId, id);
                    navigation.goBack();
                }}
            />
        </View>
    );
};

export default SearchModal;
