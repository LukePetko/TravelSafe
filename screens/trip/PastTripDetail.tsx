import React, { useRef } from "react";
import MapView, { Polyline } from "react-native-maps";
import { View, Text } from "../../components/Themed";
import { tintColorLight } from "../../constants/Colors";

type PastTripDetailProps = {
    navigation: any;
    route: any;
};

const PastTripDetail = (props: PastTripDetailProps) => {
    const { navigation, route } = props;
    const { trip } = route.params;
    console.log(!!trip.path);

    const [path, setPath] = React.useState(JSON.parse(trip.path));
    const mapRef = useRef(null);

    return (
        <View style={{ flex: 1 }}>
            <Text>hello</Text>
            <MapView
                style={{ height: 400, marginVertical: 10 }}
                ref={mapRef}
                onLayout={() => {
                    mapRef.current.fitToCoordinates(path, {
                        edgePadding: {
                            top: 50,
                            right: 50,
                            bottom: 50,
                            left: 50,
                        },
                        animated: true,
                    });
                }}
            >
                <Polyline
                    coordinates={path}
                    strokeWidth={3}
                    strokeColor={tintColorLight}
                />
            </MapView>
        </View>
    );
};

export default PastTripDetail;
