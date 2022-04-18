import { View, Text, Image } from "react-native";
import React from "react";
import { Post } from "../utils/types/post";

type PostComponentProps = {
    post: Post;
    navigation?: any;
};

const PostComponent = (props: PostComponentProps) => {
    const { post, navigation } = props;

    console.log(post.images[0]);

    return (
        <View>
            <Text>{post.description}</Text>
            <Image
                source={{ uri: post.images[0] }}
                style={{
                    width: 300,
                    height: 300,
                }}
            />
        </View>
    );
};

export default PostComponent;
