import React from "react";
import { StyleSheet } from "react-native";
import { connectInfiniteHits } from "react-instantsearch-native";
import {
    KeyboardAvoidingView,
    Pressable,
    ScrollView,
    Text,
    View,
} from "./Themed";
import { styles } from "../styles/global";

const Hits = connectInfiniteHits(({ hits, hasMore, refine, onPress }: any) => {
    // console.log(hits, hasMore, onPress);

    const onEndReached = () => {
        if (hasMore) {
            refine();
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={"padding"}
            style={{
                // flex: 1,
                height: "100%",
            }}
            enabled
            keyboardVerticalOffset={90}
        >
            <ScrollView>
                {hits.map((hit: any) => (
                    <Pressable
                        onPress={() => {
                            onPress(hit.objectID);
                        }}
                        style={localStyles.hit}
                        key={hit.objectID}
                    >
                        <Text>{hit.username}</Text>
                    </Pressable>
                ))}
            </ScrollView>
        </KeyboardAvoidingView>
    );
});

const localStyles = StyleSheet.create({
    container: {
        flex: 1,
    },
    hit: {
        paddingTop: 20,
        paddingLeft: 20,
        paddingBottom: 10,
        borderBottomWidth: 1,
        backgroundColor: "transparent",
    },
});

export default Hits;
