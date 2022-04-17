import {
    View,
    Text,
    ScrollView,
    KeyboardAvoidingView,
} from "../../components/Themed";
import { styles } from "../../styles/global";
import ListLabel from "../../components/ListLabel";
import ListInput from "../../components/ListInput";
import { tintColorLight } from "../../constants/Colors";
import { SFSymbol } from "react-native-sfsymbols";
import { Trip } from "../../utils/types/trip";
import React, { useEffect, useState } from "react";
import { getEndedUserTrips } from "../../api/firestore";
import { getUserId } from "../../redux/stores/user";
import store from "../../redux/store";
import { Timestamp } from "firebase/firestore";
import * as ImagePicker from "expo-image-picker";
import { getPictureBlob } from "../../utils/files";
import { Image, Pressable } from "react-native";
import { createPost } from "../../api/firestore/posts";

type ImageContainer = {
    uri: string;
    file: File;
};

type NewPostState = {
    trip: Trip | null;
    description: string;
    photos: ImageContainer[];
};

type NewPostProps = {
    navigation: any;
    route: any;
};

const NewPost = (props: NewPostProps) => {
    const { navigation, route } = props;

    const [tripId, setTripId] = useState<string>("");

    const [trips, setTrips] = useState<Trip[]>([]);
    const [showTrips, setShowTrips] = useState(false);

    const [postState, setPostState] = useState<NewPostState>({
        trip: null,
        description: "",
        photos: [],
    });

    const onChange = (
        key: keyof NewPostState,
        value: string | Trip | null,
    ): void => {
        setPostState({
            ...postState,
            [key]: value,
        });
    };

    const getDate = (date: Date | Timestamp): string => {
        if (date instanceof Date) {
            return date.toLocaleDateString();
        }

        return new Date(date.seconds * 1000).toLocaleDateString();
    };

    const addImage = async (): Promise<ImageContainer | null> => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.1,
        });

        if (!result.cancelled) {
            return {
                uri: result.uri,
                file: await getPictureBlob(result.uri),
            };
        }

        return null;
    };

    const onSubmit = async (): Promise<void> => {
        const { description, photos } = postState;

        const userId = getUserId(store.getState());
        const tripId = postState.trip?.id;

        console.log(
            await createPost(
                userId,
                tripId ? tripId : null,
                description,
                photos.map((p) => p.file),
            ),
        );

        // navigation.navigate("Home");
    };

    useEffect(() => {
        console.log(route.params);
        setTripId(route.params?.tripId);
        getEndedUserTrips(getUserId(store.getState())).then((trips) => {
            setTrips(trips);
            setPostState({
                ...postState,
                trip: trips.find((trip) => trip.id === tripId) || null,
            });
        });
        console.log(tripId);
    }, []);

    return (
        <KeyboardAvoidingView
            behavior={"padding"}
            style={{
                flex: 1,
                height: "100%",
                marginTop: 20,
            }}
            enabled
            keyboardVerticalOffset={90}
        >
            <ScrollView>
                <Text
                    style={{
                        fontWeight: "bold",
                        fontSize: 32,
                        padding: 10,
                    }}
                >
                    New Post
                </Text>
                <View style={[styles.container, { marginTop: 20 }]}>
                    {trips.length > 0 && (
                        <ListLabel
                            showChevron={true}
                            borderRadius={{ top: true }}
                            separator={true}
                            rotateChevron={showTrips}
                            onPress={() => setShowTrips(!showTrips)}
                            fieldValue={postState.trip?.name}
                        >
                            Trip
                        </ListLabel>
                    )}
                    {showTrips && (
                        <>
                            <ListLabel
                                separator={true}
                                onPress={() => {
                                    onChange("trip", null);
                                    setShowTrips(false);
                                }}
                            >
                                No Trip
                            </ListLabel>

                            {trips.map((trip) => (
                                <ListLabel
                                    key={trip.id}
                                    separator={true}
                                    onPress={() => {
                                        onChange("trip", trip);
                                        setShowTrips(false);
                                    }}
                                >
                                    {trip.name} - {getDate(trip.startTime)}
                                </ListLabel>
                            ))}
                        </>
                    )}
                    <ListInput
                        placeholder="Description"
                        borderRadius={{ bottom: true }}
                        value={postState.description}
                        onChangeText={(text) => onChange("description", text)}
                    />

                    <ListLabel
                        style={{
                            marginTop: 20,
                        }}
                        borderRadius={{
                            top: true,
                            bottom: postState.photos.length == 0,
                        }}
                        separator={postState.photos.length > 0}
                        showChevron
                        onPress={() => {
                            addImage().then((image) => {
                                if (image) {
                                    setPostState({
                                        ...postState,
                                        photos: [...postState.photos, image],
                                    });
                                }
                            });
                        }}
                        fieldValue={`${postState.photos.length} photo${
                            postState.photos.length == 1 ? "" : "s"
                        }`}
                    >
                        Add Photos
                    </ListLabel>

                    {postState.photos.length > 0 && (
                        <ListLabel borderRadius={{ bottom: true }}>
                            {postState.photos.map((photo, index) => (
                                <Pressable
                                    key={index}
                                    onPress={() => {
                                        setPostState({
                                            ...postState,
                                            photos: postState.photos.filter(
                                                (p) => p !== photo,
                                            ),
                                        });
                                    }}
                                    style={{
                                        paddingHorizontal: 3,
                                        paddingVertical: 10,
                                    }}
                                >
                                    <Image
                                        source={{
                                            uri: photo.uri,
                                        }}
                                        style={{
                                            width: 100,
                                            height: 100,
                                        }}
                                    />
                                    <SFSymbol
                                        name="trash"
                                        size={20}
                                        color="red"
                                    />
                                </Pressable>
                            ))}
                        </ListLabel>
                    )}

                    <ListLabel
                        style={{ marginTop: 20 }}
                        textStyles={{ color: tintColorLight }}
                        borderRadius={{
                            top: true,
                            bottom: true,
                        }}
                        icon={
                            <SFSymbol
                                name="plus"
                                weight="semibold"
                                scale="medium"
                                color={tintColorLight}
                                size={18}
                                resizeMode="center"
                                multicolor={false}
                                style={{
                                    width: 32,
                                    height: 32,
                                }}
                            />
                        }
                    >
                        Tag Friends
                    </ListLabel>

                    <ListLabel
                        style={{ marginTop: 20 }}
                        textStyles={{ color: tintColorLight }}
                        borderRadius={{
                            top: true,
                            bottom: true,
                        }}
                        onPress={() => onSubmit()}
                    >
                        Create Post
                    </ListLabel>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default NewPost;
