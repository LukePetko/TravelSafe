import { createSlice, PayloadAction, Slice } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface UserState {
    user: number | null;
}

const initialState = {
    user: null,
} as UserState;

export const userSlice: Slice = createSlice({
    name: "user",
    initialState,
    reducers: {
        login: (state, payload?: PayloadAction<string>) => {
            state.user = payload;
        },
        logout: (state?) => {
            state.user = null;
        },
    },
});

export const { login, logout } = userSlice.actions;
export const getUserId = (state: RootState): string => state.user.user;
export default userSlice.reducer;
