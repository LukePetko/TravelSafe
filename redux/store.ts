import { configureStore } from "@reduxjs/toolkit";
import userReducer from './stores/user';

export const store = configureStore({
    reducer: {
        user: userReducer,
    },
});
