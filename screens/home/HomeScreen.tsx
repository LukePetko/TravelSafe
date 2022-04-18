import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { getUser, getUserId } from "../../redux/stores/user";
import store from "../../redux/store";
import { getUserById } from "../../api/firestore";
import { FollowUser } from "../../utils/types/user";
import { Post } from "../../utils/types/post";
import { getPostsFromUsers } from "../../api/firestore/posts";

const HomeScreen = () => {
    const [followed, setFollowed] = useState<string[]>([]);
    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
        (async () => {
            const user = await getUserById(getUserId(store.getState()));

            if (user) {
                // setFollowed(user.following.map((u: FollowUser) => u.id));
                setPosts(
                    (await getPostsFromUsers(
                        await user.following.map((u: FollowUser) => u.id),
                    )) as Post[],
                );

                console.log(posts.map((p: Post) => p.username));
                // console.log(followed);
            }
        })();
    }, []);

    return (
        <View>
            <Text>HomeScreen</Text>
        </View>
    );
};

export default HomeScreen;
