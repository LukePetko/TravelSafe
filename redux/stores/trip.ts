import { createSlice, PayloadAction, Slice } from "@reduxjs/toolkit";
import { GeoPoint } from "firebase/firestore";
import { RootState } from "../store";

export interface Location {
    latitude: number;
    longitude: number;
}
interface TripState {
    trip: number | null;
    path: Location[];
}

const initialState = {
    trip: null,
    path: [],
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
    },
});

export const { start, end } = tripSlice.actions;
export const getTripId = (state: RootState): string => state.trip.trip.payload;
export const getPath = (state: RootState): Location[] =>
    state.trip.path.payload;
export default tripSlice.reducer;
