import { Text, FlatList, RefreshControl } from "react-native";
import React, { useEffect, useState } from "react";
import { getUserId } from "../../redux/stores/user";
import store from "../../redux/store";
import { getUserById } from "../../api/firestore";
import { FollowUser } from "../../utils/types/user";
import { Post } from "../../utils/types/post";
import { getPostsFromUsers } from "../../api/firestore/posts";
import PostComponent from "../../components/PostComponent";
import { View } from "../../components/Themed";
import { styles } from "../../styles/global";

type HomeScreenProps = {
    navigation: any;
};

const HomeScreen = (props: HomeScreenProps) => {
    const { navigation } = props;

    const [followed, setFollowed] = useState<string[]>([]);
    const [posts, setPosts] = useState<Post[]>([]);

    const loadPosts = async () => {
        const user = await getUserById(getUserId(store.getState()));

        if (user) {
            setPosts(
                (await getPostsFromUsers(
                    await user.following.map((u: FollowUser) => u.id),
                )) as Post[],
            );
        }
    };

    useEffect(() => {
        loadPosts();
    }, []);

    return (
        <View style={{ flex: 1 }}>
            <FlatList
                ListEmptyComponent={
                    <View style={styles.container}>
                        <Text style={{ fontWeight: "600", marginTop: 50 }}>
                            No posts to show
                        </Text>
                    </View>
                }
                data={posts}
                renderItem={({ item }) => (
                    <PostComponent post={item} navigation={navigation} />
                )}
                keyExtractor={(item: Post) => `item ${item.id}`}
                refreshControl={
                    <RefreshControl
                        refreshing={false}
                        onRefresh={() => {
                            loadPosts();
                        }}
                    />
                }
            />
        </View>
    );
};

export default HomeScreen;
