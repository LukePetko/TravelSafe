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
    tripName: "",
    startTime: new Date(),
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
        addTripName: (state, payload: PayloadAction<string>) => {
            state.tripName = payload.payload;
        },
        addStartTime: (state, payload: PayloadAction<Date>) => {
            state.startTime = payload.payload;
        },
    },
});

export const {
    start,
    end,
    addPoint,
    addDistance,
    resetDistance,
    addTripName,
    addStartTime,
} = tripSlice.actions;
export const getTripId = (state: RootState): string => state.trip.trip;
export const getPath = (state: RootState): Location[] => state.trip.path;
export const getDistance = (state: RootState): number => state.trip.distance;
export const getTripName = (state: RootState): string => state.trip.tripName;
export const getStartTime = (state: RootState): Date => state.trip.startTime;
export default tripSlice.reducer;
