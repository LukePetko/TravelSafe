import { createNativeStackNavigator } from "@react-navigation/native-stack";
import EditTripScreen from "../../../screens/trip/EditTripScreen";
import HolidayDetailScreen from "../../../screens/trip/HolidayDetailScreen";
import HolidayScreen from "../../../screens/trip/HolidayScreen";
import NewHolidayScreen from "../../../screens/trip/NewHolidayScreen";
import NewTripScreen from "../../../screens/trip/NewTripScreen";
import PastHolidayDetailScreen from "../../../screens/trip/PastHolidayDetailScreen";
import PastTripDetail from "../../../screens/trip/PastTripDetail";
import PastTripsScreen from "../../../screens/trip/PastTripsScreen";
import PlannedHolidayDetailScreen from "../../../screens/trip/PlannedHolidayDetailScreen";
import PlannedTripsScreen from "../../../screens/trip/PlannedTripsScreen";
import TripScreen from "../../../screens/trip/TripScreen";
import { TripStackParamList } from "../../../types";

const TripStack = createNativeStackNavigator<TripStackParamList>();

export const TripStackNavigator = (): JSX.Element => {
    return (
        <TripStack.Navigator>
            <TripStack.Screen name="Trips" component={TripScreen} />
            <TripStack.Screen
                name="NewTrip"
                component={NewTripScreen}
                options={{
                    headerShown: true,
                    title: "New Trip",
                }}
            />
            <TripStack.Screen
                name="NewHoliday"
                component={NewHolidayScreen}
                options={{
                    headerShown: true,
                    title: "New Holiday",
                }}
            />
            <TripStack.Screen
                name="PlannedTrips"
                component={PlannedTripsScreen}
                options={{
                    headerShown: true,
                    title: "Planned Trips",
                }}
            />
            <TripStack.Screen
                name="PastTrips"
                component={PastTripsScreen}
                options={{
                    headerShown: true,
                    title: "Past Trips",
                }}
            />
            <TripStack.Screen
                name="EditTrip"
                component={EditTripScreen}
                options={{
                    headerShown: true,
                    title: "Edit Trip",
                }}
            />
            <TripStack.Screen
                name="PastTripDetail"
                component={PastTripDetail}
                options={{
                    headerShown: true,
                }}
            />
            <TripStack.Screen
                name="Holiday"
                component={HolidayScreen}
                options={{
                    headerShown: true,
                }}
            />
            <TripStack.Screen
                name="HolidayDetail"
                component={HolidayDetailScreen}
                options={{
                    headerShown: true,
                }}
            />
        </TripStack.Navigator>
    );
};
