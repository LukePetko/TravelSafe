import { View, Image, StyleSheet, useColorScheme } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { Post } from "../utils/types/post";
import { width } from "../utils/dimensions";
import { Pressable, Text } from "./Themed";
import { SFSymbol } from "react-native-sfsymbols";
import { getTimeDifference } from "../utils/time";
import { deletePost, removeLikePost } from "../api/firestore/posts";
import { getUserId } from "../redux/stores/user";
import store from "../redux/store";
import { handleLike } from "../utils/likes";
import Carousel, { getInputRangeFromIndexes } from "react-native-snap-carousel";
import { deletePostAlert } from "../utils/alers";

type PostComponentProps = {
    post: Post;
    navigation?: any;
    isOwn?: boolean;
};

const PostComponent = (props: PostComponentProps) => {
    const { post, navigation, isOwn } = props;

    const userId = getUserId(store.getState());
    const isLiked = () => {
        return post.likes.map((u) => u.id).includes(userId);
    };

    const [liked, setLiked] = useState<boolean>(false);
    const [likes, setLikes] = useState<number>(post.likes.length);
    const [photoIndex, setPhotoIndex] = useState<number>(0);

    let carousel = useRef();

    const colorScheme = useColorScheme();

    const scrollInterpolator = (index: number, carouselProps: any) => {
        const range = [1, 0, -1];
        const inputRange = getInputRangeFromIndexes(
            range,
            index,
            carouselProps,
        );
        const outputRange = range;

        return { inputRange, outputRange };
    };

    useEffect(() => {
        setLiked(isLiked());
    }, []);

    return (
        <View
            style={{
                marginBottom: 20,
            }}
        >
            <Pressable
                onPress={() => {
                    navigation.navigate("ProfileScreen", {
                        id: post.userId,
                    });
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
            <Carousel
                ref={(c: any) => (carousel = c)}
                data={post.images}
                renderItem={(item) => (
                    <Image
                        source={{ uri: item.item }}
                        style={localStyles.image}
                    />
                )}
                sliderWidth={width}
                itemWidth={width}
                inactiveSlideShift={0}
                onSnapToItem={(index) => setPhotoIndex(index)}
                scrollInterpolator={scrollInterpolator}
                useScrollView={true}
            />
            <Text
                style={{
                    fontSize: 12,
                    fontWeight: "500",
                    marginLeft: 10,
                }}
            >
                {photoIndex + 1}/{post.images.length}
            </Text>
            <View style={localStyles.buttonContainer}>
                <Pressable
                    style={{ backgroundColor: "transparent" }}
                    onPress={() => {
                        if (!liked) {
                            handleLike(
                                getUserId(store.getState()),
                                post.id!,
                                post.userId,
                            );
                            setLiked(true);
                            setLikes(likes + 1);
                        } else {
                            removeLikePost(
                                getUserId(store.getState()),
                                post.id!,
                            );
                            setLiked(false);
                            setLikes(likes - 1);
                        }
                    }}
                >
                    <View style={localStyles.innerContainer}>
                        {liked ? (
                            <SFSymbol
                                name="heart.fill"
                                size={32}
                                color="red"
                                style={localStyles.innerIcon}
                            />
                        ) : (
                            <SFSymbol
                                name="heart"
                                size={32}
                                color={
                                    colorScheme === "dark" ? "white" : "black"
                                }
                                style={localStyles.innerIcon}
                            />
                        )}
                        <Text style={localStyles.innerText}>{likes}</Text>
                    </View>
                </Pressable>
                {isOwn && (
                    <Pressable
                        onPress={() =>
                            deletePostAlert(
                                colorScheme as "dark" | "light" | undefined,
                                () => {
                                    deletePost(post.id!);
                                },
                            )
                        }
                        style={{ backgroundColor: "transparent" }}
                    >
                        <View style={localStyles.innerContainer}>
                            <SFSymbol
                                name="xmark"
                                size={32}
                                color={"red"}
                                style={{ marginTop: 8 }}
                            />
                        </View>
                    </Pressable>
                )}
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
        justifyContent: "space-between",
        marginLeft: 26,
        marginTop: 20,
    },
    innerContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
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
