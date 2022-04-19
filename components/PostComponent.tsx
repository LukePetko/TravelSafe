import { View, Image, StyleSheet } from "react-native";
import React from "react";
import { Post } from "../utils/types/post";
import { width } from "../utils/dimensions";
import { Pressable, Text } from "./Themed";
import { SFSymbol } from "react-native-sfsymbols";
import { getTimeDifference } from "../utils/time";

type PostComponentProps = {
    post: Post;
    navigation?: any;
};

const PostComponent = (props: PostComponentProps) => {
    const { post, navigation } = props;

    return (
        <View
            style={{
                marginBottom: 20,
            }}
        >
            <Pressable
                onPress={() => {
                    console.log(post);
                    navigation.navigate("ProfileScreen", post.userId);
                }}
                style={{
                    backgroundColor: "transparent",
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
                    <Text>
                        <Text style={localStyles.username}>
                            {post.username}
                        </Text>
                        {" ⦁ " + getTimeDifference(post.createdAt.toDate())}
                    </Text>
                </View>
            </Pressable>
            <Image source={{ uri: post.images[0] }} style={localStyles.image} />
            <View style={localStyles.buttonContainer}>
                <View style={localStyles.innerContainer}>
                    <SFSymbol
                        name="heart"
                        size={32}
                        color={"#000000"}
                        style={localStyles.innerIcon}
                    />
                    <Text style={localStyles.innerText}>
                        {post.likes.length}
                    </Text>
                </View>
                <View style={localStyles.innerContainer}>
                    <SFSymbol
                        name="message"
                        size={32}
                        color={"#000000"}
                        style={localStyles.innerIcon}
                    />
                    <Text style={localStyles.innerText}>
                        {post.comments.length}
                    </Text>
                </View>
            </View>
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
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "flex-start",
        marginLeft: 26,
        marginTop: 20,
    },
    innerContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginRight: 35,
    },
    innerIcon: {
        marginRight: 16,
    },
    innerText: {
        marginLeft: 5,
    },
    description: {
        margin: 10,
        marginTop: 20,
    },
});

export default PostComponent;
