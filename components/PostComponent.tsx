import { View, Text, Image, StyleSheet } from "react-native";
import React from "react";
import { Post } from "../utils/types/post";
import { width } from "../utils/dimensions";
import { Pressable } from "./Themed";

type PostComponentProps = {
    post: Post;
    navigation?: any;
};

const PostComponent = (props: PostComponentProps) => {
    const { post, navigation } = props;

    console.log(post.userId);

    return (
        <View>
            <Pressable
                onPress={() => {
                    console.log(post);
                    navigation.navigate("ProfileScreen", post.userId);
                }}
            >
                <View style={localStyles.nameContainer}>
                    <Image
                        source={{
                            uri:
                                post.userProfilePicture ||
                                "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg",
                        }}
                        style={localStyles.profilePicture}
                    />
                    <Text style={localStyles.username}>{post.username}</Text>
                </View>
            </Pressable>
            <Image source={{ uri: post.images[0] }} style={localStyles.image} />
            <Text style={localStyles.description}>
                <Text style={localStyles.username}>{post.username} </Text>
                {post.description}
            </Text>
        </View>
    );
};

const localStyles = StyleSheet.create({
    nameContainer: {
        flexDirection: "row",
        alignItems: "center",
        margin: 10,
    },
    profilePicture: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    username: {
        fontWeight: "bold",
    },
    image: {
        width: width,
        height: width,
    },
    description: {
        margin: 10,
    },
});

export default PostComponent;
