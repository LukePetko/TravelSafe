import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
    user: number | null;
}

const initialState: UserState = {
    user: null,
}

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        login: (state, action: PayloadAction<number>) => {
            state.user = action.payload;
        },
        logout: (state) => {
            state.user = null;
        },
    }
});

export const { login, logout } = userSlice.actions;
export const getUserId = (state: UserState) => state.user;
export default userSlice.reducer;