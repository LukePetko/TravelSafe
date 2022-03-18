import { createSlice, PayloadAction, Slice } from "@reduxjs/toolkit";
import { GeoPoint } from "firebase/firestore";
import { CurrentTripInfo } from "../../utils/types/currentTripInfo";
import { RootState } from "../store";

export interface Location {
    latitude: number;
    longitude: number;
}
interface TripState {
    trip: number | null;
    path: Location[];
    closeContacts: CurrentTripInfo[];
}

const initialState = {
    trip: null,
    path: [],
    closeContacts: [],
} as TripState;

export const tripSlice: Slice = createSlice({
    name: "trip",
    initialState,
    reducers: {
        start: (state, payload?: PayloadAction<string>) => {
            state.trip = payload;
        },
        end: (state?) => {
            state.trip = null;
            state.path = [];
        },
        addPoint: (state, payload: PayloadAction<Location>) => {
            state.path.push(payload.payload);
        },
        updateTrip: (state, payload: PayloadAction<CurrentTripInfo>) => {
            // if close contact is already in the list, update it
            const index = state.closeContacts.findIndex(
                (contact: CurrentTripInfo) => contact.id === payload.payload.id,
            );

            if (index !== -1) {
                state.closeContacts[index] = payload.payload;
            } else {
                state.closeContacts.push(payload.payload);
            }
        },
        deleteTrip: (state, payload: PayloadAction<string>) => {
            state.closeContacts = state.closeContacts.filter(
                (contact: CurrentTripInfo) => contact.id !== payload.payload,
            );
        },
    },
});

export const { start, end, addPoint, updateTrip, deleteTrip } =
    tripSlice.actions;
export const getTripId = (state: RootState): string => state.trip.trip.payload;
export const getPath = (state: RootState): Location[] =>
    state.trip.path.payload;
export const getCloseContacts = (state: RootState): CurrentTripInfo[] =>
    state.trip.closeContacts.payload;
export default tripSlice.reducer;
