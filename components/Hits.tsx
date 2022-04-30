import React from "react";
import { FlatList, StyleSheet, useColorScheme } from "react-native";
import { connectInfiniteHits } from "react-instantsearch-native";
import { Pressable, Text } from "./Themed";
import Colors from "../constants/Colors";

const Hits = connectInfiniteHits(({ hits, hasMore, refine, onPress }: any) => {
    const onEndReached = () => {
        if (hasMore) {
            refine();
        }
    };

    const colorScheme = useColorScheme();

    return (
        <>
            {hits.length > 0 &&
                hits[0]._highlightResult.username.matchLevel !== "none" && (
                    <FlatList
                        data={hits}
                        renderItem={({ item }: any) => (
                            <Pressable
                                onPress={() => {
                                    onPress(item.objectID);
                                }}
                                style={[
                                    localStyles.hit,
                                    {
                                        borderBottomColor:
                                            colorScheme === "dark"
                                                ? Colors.dark.bottomBorderColor
                                                : Colors.light
                                                      .bottomBorderColor,
                                    },
                                ]}
                                key={item.objectID}
                            >
                                <Text>{item.username}</Text>
                            </Pressable>
                        )}
                        keyExtractor={(item: any) => item.objectID}
                        onEndReached={onEndReached}
                        onEndReachedThreshold={0.5}
                    />
                )}
        </>
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
