// import { configureStore } from "@reduxjs/toolkit";
// import userReducer from "./userSlice";
// import movieReducer from "./movieSilce";

// export const store = configureStore({
//   reducer: {
//     user: userReducer,
//     movies: movieReducer,
//   },
// });

// // Infer the `RootState` and `AppDispatch` types from the store itself
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;

import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import movieReducer from "./movieSilce";
import { loadUserState, saveUserState } from "./localStorageHelper";

// Load the persisted user state
const persistedUserState = loadUserState();

export const store = configureStore({
  reducer: {
    user: userReducer,
    movies: movieReducer,
  },
  preloadedState: {
    user: persistedUserState,
  },
});

// Subscribe to store changes
store.subscribe(() => {
  // Only save the user slice of the state
  saveUserState(store.getState().user);
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
