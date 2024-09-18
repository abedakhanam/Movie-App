import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  userID: number | null;
  firstName: string | null;
  lastName: string | null;
  token: string | null;
  email: string | null;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  userID: null,
  firstName: null,
  lastName: "",
  token: null,
  email: "",
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{
        userID: number;
        firstName: string;
        lastName: string;
        token: string;
        email: string;
      }>
    ) => {
      console.log(`${action.payload.userID}`);
      state.userID = action.payload.userID;
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
      state.token = action.payload.token;
      state.email = action.payload.email;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.userID = null;
      state.firstName = "";
      state.lastName = "";
      state.token = null;
      state.email = "";
      state.isAuthenticated = false;
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
