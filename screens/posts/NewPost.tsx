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

type NewPostState = {
    trip: Trip | null;
    description: string;
    photos: any[];
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
                        borderRadius={{ top: true, bottom: true }}
                        showChevron
                    >
                        Add Photos
                    </ListLabel>

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
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default NewPost;
