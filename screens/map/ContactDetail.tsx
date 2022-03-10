import { getDistance } from "geolib";
import React, { useEffect, useState } from "react";
import { Text } from "../../components/Themed";
import { CurrentTripInfo } from "../../utils/types/currentTripInfo";
import { Image, StyleSheet, View } from "react-native";
import { distanceText } from "../../utils/distance";
import { getTimeDifference } from "../../utils/time";

type ContactDetailProps = {
    contact: CurrentTripInfo;
    userLocation: any;
    isOwn?: boolean;
};

const ContactDetail = (props: ContactDetailProps): JSX.Element => {
    const { contact, userLocation, isOwn } = props;

    const [distance, setDistance] = useState<number | null>(null);

    useEffect(() => {
        if (contact.location) {
            (async () => {
                const _userLocation = await userLocation();
                if (!_userLocation) return;
                const contactLocation = contact.location;
                const distance = getDistance(
                    {
                        latitude: _userLocation.coords.latitude,
                        longitude: _userLocation.coords.longitude,
                    },
                    {
                        latitude: contactLocation?.latitude || 0,
                        longitude: contactLocation?.longitude || 0,
                    },
                );

                setDistance(distance);
            })();
        }
    }, []);

    return (
        <View style={localStyles.container}>
            <View style={localStyles.imageContainer}>
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
            </View>
            <View style={localStyles.textContainer}>
                <Text style={{ fontWeight: "bold" }}>{contact.username}</Text>
                {contact.location && !isOwn && (
                    <Text>
                        {distanceText(distance)} ⦁ {contact.tripName} ⦁{" "}
                        {getTimeDifference(contact.updatedAt.toDate())}
                    </Text>
                )}
                {!contact.location && !isOwn && <Text>No active trip</Text>}
                {isOwn && (
                    <Text>
                        {contact.tripName} ⦁{" "}
                        {getTimeDifference(contact.updatedAt.toDate())}
                    </Text>
                )}
            </View>
        </View>
    );
};

const localStyles = StyleSheet.create({
    container: {
        borderBottomWidth: 1,
        flexDirection: "row",
        paddingVertical: 10,
    },
    imageContainer: {
        paddingHorizontal: 10,
    },
    textContainer: {
        flexDirection: "column",
        justifyContent: "space-around",
    },
});

export default ContactDetail;
