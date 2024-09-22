import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import movieReducer from "./movieSilce";
import watchlistReducer from "./watchlistSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    movies: movieReducer,
    watchlist: watchlistReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
