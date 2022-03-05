import { createSlice, PayloadAction, Slice } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface TripState {
    trip: number | null;
}

const initialState = {
    trip: null,
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
        },
    },
});

export const { start, end } = tripSlice.actions;
export const getTripId = (state: RootState): string => state.trip.trip.payload;
export default tripSlice.reducer;
