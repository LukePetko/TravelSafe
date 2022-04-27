import { createSlice, PayloadAction, Slice } from "@reduxjs/toolkit";
import { User } from "../../utils/types/user";
import { RootState } from "../store";

interface UserState {
    userId: number | null;
    user: User | null;
    notificationId: string | null;
}

const initialState = {
    userId: null,
    user: null,
    notificationId: null,
} as UserState;

export const userSlice: Slice = createSlice({
    name: "user",
    initialState,
    reducers: {
        login: (state, payload?: PayloadAction<string>) => {
            state.userId = payload;
        },
        logout: (state?) => {
            state.userId = null;
        },
        setUser: (state, payload?: PayloadAction<User>) => {
            state.user = payload;
        },
        removeUser: (state) => {
            state.user = null;
        },
        setNotificationId: (state, payload?: PayloadAction<string>) => {
            state.notificationId = payload;
        },
        resetNotificationId: (state) => {
            state.notificationId = null;
        },
    },
});

export const {
    login,
    logout,
    setUser,
    removeUser,
    setNotificationId,
    resetNotificationId,
} = userSlice.actions;
export const getUserId = (state: RootState): string =>
    state?.user?.userId?.payload || "";
export const getUser = (state: RootState): User => state.user.user.payload;
export const getNotificationId = (state: RootState): string =>
    state?.user?.notificationId?.payload || "";
export default userSlice.reducer;
