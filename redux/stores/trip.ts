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
    distance: number;
}

const initialState = {
    trip: null,
    path: [],
    distance: 0,
} as TripState;

export const tripSlice: Slice = createSlice({
    name: "trip",
    initialState,
    reducers: {
        start: (state, payload?: PayloadAction<string>) => {
            state.trip = payload?.payload;
            console.log(payload?.payload);
        },
        end: (state?) => {
            state.trip = null;
            state.path = [];
        },
        addPoint: (state, payload: PayloadAction<Location>) => {
            state.path.push(payload.payload);
        },
        addDistance: (state, payload: PayloadAction<number>) => {
            state.distance += payload.payload;
        },
        resetDistance: (state) => {
            state.distance = 0;
        },
    },
});

export const { start, end, addPoint, addDistance, resetDistance } =
    tripSlice.actions;
export const getTripId = (state: RootState): string => state.trip.trip;
export const getPath = (state: RootState): Location[] => state.trip.path;
export const getDistance = (state: RootState): number => state.trip.distance;
export default tripSlice.reducer;
