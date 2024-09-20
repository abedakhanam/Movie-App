import {
  getUserCookie,
  removeUserCookie,
  setUserCookie,
} from "@/services/cookie";
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

const savedUser = getUserCookie();

const userSlice = createSlice({
  name: "user",
  initialState: savedUser || initialState,
  reducers: {
    login: (state, action: PayloadAction<UserState>) => {
      console.log(`${action.payload.userID}`);
      state.userID = action.payload.userID;
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
      state.token = action.payload.token;
      state.email = action.payload.email;
      state.isAuthenticated = true;
      // Persist to cookies
      setUserCookie(state);
    },
    logout: (state) => {
      state.userID = null;
      state.firstName = "";
      state.lastName = "";
      state.token = null;
      state.email = "";
      state.isAuthenticated = false;
      // Remove user cookie
      removeUserCookie();
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
