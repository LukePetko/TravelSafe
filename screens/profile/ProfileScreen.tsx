import { View, Text } from "../../components/Themed";
import React, { useEffect, useState } from "react";
import { getUserById, updateProfilePicture } from "../../api/firestore";
import ProfilePicture from "../../components/ProfilePicture";
import {
    ActionSheetIOS,
    FlatList,
    RefreshControl,
    StyleSheet,
    useColorScheme,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { uploadProfileImage } from "../../api/storage";
import { getPictureBlob } from "../../utils/files";
import { getUserId } from "../../redux/stores/user";
import store from "../../redux/store";
import { Post } from "../../utils/types/post";
import { getPostsFromUsers } from "../../api/firestore/posts";
import ListLabel from "../../components/ListLabel";
import { FollowUser, PublicUser, User } from "../../utils/types/user";
import {
    followUser,
    getPublicUserById,
    unfollowUser,
} from "../../api/firestore/accounts";
import PostComponent from "../../components/PostComponent";
import { connect } from "react-redux";
import { tintColorLight } from "../../constants/Colors";

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

    const colorScheme = useColorScheme();

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.1,
        });

        if (!result.cancelled) {
            const blob = await getPictureBlob(result.uri);
            const response = await uploadProfileImage(blob, userID);

            updateProfilePicture(userID, response);
        }
    };

    const onPress = () =>
        ActionSheetIOS.showActionSheetWithOptions(
            {
                options: ["Cancel", "Take A Photo", "Choose From Library"],
                cancelButtonIndex: 0,
                userInterfaceStyle: "dark",
            },
            (buttonIndex: number): void => {
                if (buttonIndex === 0) {
                    // cancel action
                } else if (buttonIndex === 1) {
                    navigation.navigate("CameraModal");
                } else if (buttonIndex === 2) {
                    pickImage();
                }
            },
        );

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
                                photoURL={
                                    user?.profilePicture ||
                                    "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"
                                }
                                onPress={onPress}
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
                                    borderRadius={{ top: true, bottom: true }}
                                    onPress={() => {
                                        isFollowing
                                            ? unfollowUser(
                                                  getUserId(store.getState()),
                                                  userID,
                                              )
                                            : followUser(
                                                  getUserId(store.getState()),
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
                    );
                }}
                data={posts}
                renderItem={({ item }) => (
                    <PostComponent post={item} navigation={navigation} />
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
