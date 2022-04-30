import { createSlice, PayloadAction, Slice } from "@reduxjs/toolkit";
import { RootState } from "../store";

export interface Location {
    latitude: number;
    longitude: number;
}
interface TripState {
    trip: number | null;
    path: Location[];
    distance: number;
    tripName: string;
    startTime: Date;
    lastMovementTime: number;
}

const initialState = {
    trip: null,
    path: [],
    distance: 0,
    tripName: "",
    startTime: new Date(),
    lastMovementTime: 0,
} as TripState;

export const tripSlice: Slice = createSlice({
    name: "trip",
    initialState,
    reducers: {
        start: (state, payload?: PayloadAction<string>) => {
            state.trip = payload?.payload;
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
        addLastMovementTime: (state, payload: PayloadAction<number>) => {
            state.lastMovementTime += payload.payload;
        },
        resetLastMovementTime: (state) => {
            state.lastMovementTime = 0;
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
    addLastMovementTime,
    resetLastMovementTime,
} = tripSlice.actions;
export const getTripId = (state: RootState): string => state.trip.trip;
export const getPath = (state: RootState): Location[] => state.trip.path;
export const getDistance = (state: RootState): number => state.trip.distance;
export const getTripName = (state: RootState): string => state.trip.tripName;
export const getStartTime = (state: RootState): Date => state.trip.startTime;
export const getLastMovementTime = (state: RootState): number =>
    state.trip.lastMovementTime;
export default tripSlice.reducer;
