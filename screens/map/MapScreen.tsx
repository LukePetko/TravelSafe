import { View, Image } from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { styles } from "../../styles/global";
import MapView, { Marker, Polyline } from "react-native-maps";

import * as Location from "expo-location";
import { connect, useSelector } from "react-redux";
import { getUserTripDocumentRef } from "../../api/firestore";

import { Pressable, BottomSheet, Text } from "../../components/Themed";
import ContactDetail from "./ContactDetail";
import { CurrentTripInfo } from "../../utils/types/currentTripInfo";
import {
    getCloseContactsQuery,
    getUserById,
} from "../../api/firestore/accounts";
import { onSnapshot } from "firebase/firestore";
import { useStoreSelector } from "../../hooks/useStoreSelector";
import { getUserId } from "../../redux/stores/user";
import store from "../../redux/store";
import { User } from "../../utils/types/user";
import { getPath, getTripId } from "../../redux/stores/trip";

type MapCoords = {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
};

type MapScreenProps = {
    navigation: any;
    userId?: string;
    tripId?: string;
    path?: any;
};

const mapStateToProps = (state: any) => ({
    userId: getUserId(state),
    tripId: getTripId(state),
    path: getPath(state),
});

const MapScreen = (props: MapScreenProps): JSX.Element => {
    const { navigation, userId, tripId, path } = props;

    const [mapRegion, setmapRegion] = useState<MapCoords>({
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
    });

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [user, setUser] = useState<User | null>(null);
    const [contactsTripInfo, setContactsTripInfo] = useState<CurrentTripInfo[]>(
        [],
    );
    const [userTripInfo, setUserTripInfo] = useState<CurrentTripInfo | null>(
        null,
    );
    const [followUserLocation, setFollowUserLocation] = useState<boolean>(true);

    useEffect(() => {
        (async () => {
            setUser((await getUserById(userId || "")) as User);
        })();
    }, []);

    useEffect(() => {
        console.log("userTripId", tripId);
    }, [tripId]);

    useEffect(() => {
        console.log("rerender!");
    }, []);

    // useEffect(() => {
    //     console.log(path);
    // }, [path]);

    useEffect(() => {
        console.log("user loaded", user?.id);

        user?.closeContacts?.forEach((contactId) => {
            onSnapshot(getUserTripDocumentRef(contactId.id), (snapshot) => {
                const tripInfo = snapshot.data() as CurrentTripInfo;
                if (
                    !contactsTripInfo.some(
                        (contactTripInfo) => contactTripInfo.id === tripInfo.id,
                    )
                ) {
                    setContactsTripInfo((prev) => [...prev, tripInfo]);
                }
            });
        });
    }, [user]);

    // console.log(userId);

    // const unsubscribeUser = onSnapshot(
    //     getUserTripDocumentRef(userId),
    //     (snapshot) => {
    //         if (snapshot.exists()) {
    //             // console.log(snapshot.data());
    //             if (
    //                 userTripInfo?.tripName !== snapshot.data().tripName ||
    //                 userTripInfo?.location?.latitude !==
    //                     snapshot.data().location.latitude ||
    //                 userTripInfo?.location?.longitude !==
    //                     snapshot.data().location.longitude
    //             ) {
    //                 if (!snapshot.data().tripName) {
    //                     setUserTripInfo(null);
    //                     return;
    //                 }
    //                 const data = snapshot.data();
    //                 if (data) {
    //                     const userTripInfo = {
    //                         id: data.id,
    //                         username: data.username,
    //                         profilePicture: data.profilePicture,
    //                         location: data.location
    //                             ? {
    //                                   latitude: data.location?.latitude,
    //                                   longitude: data.location?.longitude,
    //                                   latitudeDelta: 0.0001,
    //                                   longitudeDelta: 0.0001,
    //                               }
    //                             : null,
    //                         tripName: data.tripName,
    //                         createdAt: data.createdAt,
    //                         updatedAt: data.updatedAt,
    //                     };
    //                     setUserTripInfo(userTripInfo);
    //                 }
    //             }
    //         }
    //     },
    // );

    // useEffect(() => {
    //     // console.log(tripPath, "tripPath");
    // }, [tripPath]);

    // useEffect(() => {
    //     (async () => {
    //         const closeContactsQuery = await getCloseContactsQuery(userId);

    //         if (closeContactsQuery) {
    //             const closeContactsUnsubscribe = onSnapshot(
    //                 closeContactsQuery,
    //                 (snapshot) => {
    //                     snapshot.forEach((doc) => {
    //                         const tripData = doc.data();
    //                         const closeContact: CurrentTripInfo = {
    //                             id: tripData?.id,
    //                             username: tripData?.username,
    //                             location: tripData?.location
    //                                 ? {
    //                                       latitude: tripData?.location.latitude,
    //                                       longitude:
    //                                           tripData?.location.longitude,
    //                                       latitudeDelta: 0.0001,
    //                                       longitudeDelta: 0.0001,
    //                                   }
    //                                 : null,
    //                             profilePicture: tripData?.profilePicture,
    //                             tripName: tripData?.tripName,
    //                             createdAt: tripData?.createdAt,
    //                             updatedAt: tripData?.updatedAt,
    //                         };

    //                         setContactsTripInfo((prev) => {
    //                             let contactsCopy: CurrentTripInfo[] = [];
    //                             if (prev) {
    //                                 contactsCopy = [...prev];
    //                                 const index = contactsCopy.findIndex(
    //                                     (contact) =>
    //                                         contact.id === tripData?.id,
    //                                 );
    //                                 if (index !== -1) {
    //                                     contactsCopy[index] = closeContact;
    //                                     return contactsCopy;
    //                                 }
    //                                 return [...contactsCopy, closeContact];
    //                             }
    //                             return [closeContact];
    //                         });
    //                     });
    //                 },
    //             );
    //             // console.log(contactsTripInfo);
    //         }
    //     })();
    // }, []);

    useEffect((): void => {
        (async (): Promise<void> => {
            let { status }: { status: string } =
                await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                return;
            }

            let location: Location.LocationObject =
                await Location.getCurrentPositionAsync({});
            const {
                latitude,
                longitude,
            }: { latitude: number; longitude: number } = location.coords;
            setmapRegion({
                latitude,
                longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            });
            setIsLoading(false);
        })();
    }, []);

    // variables
    const snapPoints = useMemo(() => ["5%", "50%"], []);

    return (
        <View style={styles.container}>
            {!isLoading && (
                <>
                    <MapView
                        // provider={PROVIDER_GOOGLE}
                        style={{ alignSelf: "stretch", height: "100%" }}
                        // region={mapRegion}
                        showsUserLocation={true}
                        followsUserLocation={followUserLocation}
                        onPanDrag={() => {
                            setFollowUserLocation(false);
                        }}
                    >
                        <Polyline
                            coordinates={path}
                            strokeWidth={5}
                            strokeColor={"red"}
                        />
                        {contactsTripInfo?.map(
                            (contact: any) =>
                                contact.location && (
                                    <Marker
                                        key={contact.username}
                                        coordinate={contact.location}
                                        title={contact.username}
                                    >
                                        <Image
                                            source={{
                                                uri:
                                                    contact.profilePicture ||
                                                    "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg",
                                            }}
                                            style={{
                                                width: 50,
                                                height: 50,
                                                borderRadius: 25,
                                                borderColor: "white",
                                                borderWidth: 2,
                                            }}
                                        />
                                    </Marker>
                                ),
                        )}
                    </MapView>
                    <BottomSheet
                        // ref={bottomSheetRef}
                        index={1}
                        snapPoints={snapPoints}
                    >
                        <View>
                            {!!userTripInfo && (
                                <>
                                    <Text
                                        style={{
                                            fontWeight: "bold",
                                            fontSize: 32,
                                            padding: 10,
                                        }}
                                    >
                                        Your active trip
                                    </Text>
                                    <Pressable
                                        key={userTripInfo.username}
                                        onPress={() =>
                                            userTripInfo.location &&
                                            setmapRegion(userTripInfo.location)
                                        }
                                    >
                                        <ContactDetail
                                            contact={userTripInfo}
                                            userLocation={async () => null}
                                            isOwn={true}
                                            navigation={navigation}
                                        />
                                    </Pressable>
                                </>
                            )}
                            <Text
                                style={{
                                    fontWeight: "bold",
                                    fontSize: 32,
                                    padding: 10,
                                }}
                            >
                                Close Contacts
                            </Text>
                            {contactsTripInfo?.map((contact: any) => (
                                <Pressable
                                    key={contact.username}
                                    onPress={() =>
                                        contact.location &&
                                        setmapRegion(contact.location)
                                    }
                                >
                                    <ContactDetail
                                        contact={contact}
                                        userLocation={async () =>
                                            await Location.getLastKnownPositionAsync()
                                        }
                                    />
                                </Pressable>
                            ))}
                        </View>
                    </BottomSheet>
                </>
            )}
        </View>
    );
};

export default connect(mapStateToProps)(MapScreen);
