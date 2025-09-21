import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    accessToken: null,
  },
  reducers: {
    setUser: (state, actions) => {
      state.user = actions.payload;
    },
    setAccessToken: (state, actions) => {
      state.accessToken = actions.payload;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
    },
  },
});

export const { setUser, setAccessToken, logout } = userSlice.actions;

export default userSlice.reducer;
