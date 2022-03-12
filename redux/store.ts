import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./stores/user";
import tripReducer from "./stores/trip";

const store = configureStore({
    reducer: {
        user: userReducer,
        trip: tripReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
