import { View, Text } from "../../components/Themed";
import React, { useEffect, useState } from "react";
import {
    getUserById,
    getPublicUserById,
    updateProfilePicture,
    getPostsFromUsers,
} from "../../api/firestore";
import ProfilePicture from "../../components/ProfilePicture";
import {
    FlatList,
    RefreshControl,
    StyleSheet,
    useColorScheme,
} from "react-native";
import { uploadProfileImage } from "../../api/storage";
import { getUserId } from "../../redux/stores/user";
import store from "../../redux/store";
import { Post } from "../../utils/types/post";
import ListLabel from "../../components/ListLabel";
import { FollowUser, PublicUser, User } from "../../utils/types/user";
import { followUser, unfollowUser } from "../../api/firestore";
import PostComponent from "../../components/PostComponent";
import { connect } from "react-redux";
import { tintColorLight } from "../../constants/Colors";
import { width } from "../../utils/dimensions";
import { openImageDialog } from "../../utils/imagePicker";

type ProfileProps = {
    navigation: any;
    route?: any;
    ownUserID: string | null;
};

const mapStateToProps = (state: any) => ({
    ownUserID: getUserId(state),
});

const ProfileScreen = (props: ProfileProps): JSX.Element => {
    const { navigation, route, ownUserID } = props;

    const [user, setUser] = useState<User | PublicUser | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [isFollowing, setIsFollowing] = useState<boolean>(false);
    const [isFollower, setIsFollower] = useState<boolean>(false);
    const [userID, setUserID] = useState<string>(route.params?.id ?? ownUserID);
    const [isOwn, setIsOwn] = useState<boolean>(
        !route.params || userID === ownUserID,
    );
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const colorScheme = useColorScheme();

    const loadUser = async () => {
        if (isOwn) {
            const user = (await getUserById(userID)) as User;
            setUser(user);
        } else {
            const user = (await getPublicUserById(userID)) as PublicUser;
            setUser(user);
            const ownUserId = getUserId(store.getState());
            setIsFollowing(
                user?.followers
                    ?.map((u: FollowUser) => u.id)
                    .includes(ownUserId),
            );
            setIsFollower(
                user?.following
                    .map((u: FollowUser) => u.id)
                    .includes(ownUserId),
            );
        }
    };

    const loadPosts = async () => {
        const user = await getUserById(getUserId(store.getState()));

        if (user) {
            setPosts((await getPostsFromUsers([userID])) as Post[]);
        }
    };

    useEffect((): void => {
        loadUser();
        loadPosts();

        navigation.setOptions({
            title: user?.username ?? "Profile",
            headerTintColor: tintColorLight,
            headerTitleStyle: {
                color: colorScheme === "dark" ? "#fff" : "#000",
            },
        });
    }, []);

    if (!user) {
        return <View />;
    }

    return (
        <View style={localStyles.container}>
            <FlatList
                ListHeaderComponent={() => {
                    return (
                        <View style={localStyles.innerContainer}>
                            <ProfilePicture
                                photoURL={user?.profilePicture}
                                isLoading={isLoading}
                                onPress={
                                    isOwn
                                        ? () =>
                                              openImageDialog(
                                                  navigation,
                                                  async (blob) => {
                                                      setIsLoading(true);
                                                      const response =
                                                          await uploadProfileImage(
                                                              blob,
                                                              userID,
                                                          );

                                                      updateProfilePicture(
                                                          userID,
                                                          response,
                                                      );
                                                      setIsLoading(false);
                                                  },
                                                  colorScheme as
                                                      | "light"
                                                      | "dark"
                                                      | undefined,
                                              )
                                        : () => {}
                                }
                            />
                            <Text
                                style={{
                                    fontWeight: "bold",
                                    fontSize: 24,
                                    marginVertical: 10,
                                }}
                            >
                                {user?.username}
                            </Text>
                            <View
                                style={{
                                    flexDirection: "row",
                                }}
                            >
                                <View
                                    style={{
                                        alignItems: "center",
                                        marginHorizontal: 10,
                                        marginBottom: 20,
                                    }}
                                >
                                    <Text>Followers</Text>
                                    <Text>{user?.followerCount}</Text>
                                </View>
                                <View
                                    style={{
                                        alignItems: "center",
                                        marginHorizontal: 10,
                                        marginBottom: 20,
                                    }}
                                >
                                    <Text>Following</Text>
                                    <Text>{user?.followingCount}</Text>
                                </View>
                            </View>
                            <View
                                style={{
                                    width,
                                    alignItems: "center",
                                }}
                            >
                                {isOwn && (
                                    <ListLabel
                                        onPress={() =>
                                            navigation.navigate("NewPost")
                                        }
                                        borderRadius={{
                                            top: true,
                                            bottom: true,
                                        }}
                                    >
                                        New Post
                                    </ListLabel>
                                )}
                                {!isOwn && (
                                    <ListLabel
                                        borderRadius={{
                                            top: true,
                                            bottom: true,
                                        }}
                                        onPress={() => {
                                            isFollowing
                                                ? unfollowUser(
                                                      getUserId(
                                                          store.getState(),
                                                      ),
                                                      userID,
                                                  )
                                                : followUser(
                                                      getUserId(
                                                          store.getState(),
                                                      ),
                                                      userID,
                                                  );
                                        }}
                                    >
                                        {isFollowing
                                            ? "Unfollow"
                                            : isFollower
                                            ? "Follow Back"
                                            : "Follow"}
                                    </ListLabel>
                                )}
                            </View>
                        </View>
                    );
                }}
                data={posts}
                renderItem={({ item }) => (
                    <PostComponent
                        post={item}
                        navigation={navigation}
                        isOwn={isOwn}
                    />
                )}
                keyExtractor={(item: Post) => `item ${item.id}`}
                refreshControl={
                    <RefreshControl
                        refreshing={false}
                        onRefresh={() => {
                            loadUser();
                            loadPosts();
                        }}
                    />
                }
            />
        </View>
    );
};

const localStyles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
    },
    innerContainer: {
        flex: 1,
        marginVertical: 20,
        alignItems: "center",
    },
});

export default connect(mapStateToProps)(ProfileScreen);
