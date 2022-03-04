import { getDistance } from "geolib";
import React, { useEffect, useState } from "react";
import { Text } from "../../components/Themed";
import { CloseContact } from "../../utils/types/closeContact";
import { Image, StyleSheet, View } from "react-native";

type ContactDetailProps = {
    contact: CloseContact;
    userLocation: any;
};

const ContactDetail = (props: ContactDetailProps): JSX.Element => {
    const { contact, userLocation } = props;

    const [distance, setDistance] = useState<number>(0);

    useEffect(() => {}, []);

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
                <Text>{distance}</Text>
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
