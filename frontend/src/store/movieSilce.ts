import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Movie {
  movieID: number;
  name: string;
  thumbnailUrl: string;
  rating: number;
  type: string;
  certificate: string;
}
interface MovieState {
  movies: Movie[];
  page: number;
  hasMore: boolean;
  loading: boolean;
}
const initialState: MovieState = {
  movies: [],
  page: 1,
  hasMore: true,
  loading: false,
};

const movieSlice = createSlice({
  name: "movies",
  initialState,
  reducers: {
    loadMoviesRequest: (state) => {
      state.loading = true;
    },
    loadMoviesSuccess: (
      state,
      action: PayloadAction<{ movies: Movie[]; hasMore: boolean }>
    ) => {
      state.movies = [...state.movies, ...action.payload.movies]; // Append new movies
      state.hasMore = action.payload.hasMore;
      state.loading = false;
    },
    loadMoviesFailure: (state) => {
      state.loading = false;
    },
    incrementPage: (state) => {
      state.page += 1;
    },
    resetMovies: (state) => {
      return initialState;
    },
  },
});

export const {
  loadMoviesRequest,
  loadMoviesSuccess,
  loadMoviesFailure,
  incrementPage,
  resetMovies,
} = movieSlice.actions;

export default movieSlice.reducer;
