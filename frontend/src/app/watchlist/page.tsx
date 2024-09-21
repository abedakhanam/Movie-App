"use client";

import { AppDispatch, RootState } from "@/store/store";
import {
  fetchWatchlist,
  removeMovieFromWatchlist,
} from "@/store/watchlistReducer";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function WatchlistPage() {
  const dispatch = useDispatch<AppDispatch>();
  const token = useSelector((state: RootState) => state.user.token);
  const watchlist = useSelector((state: RootState) => state.watchlist.movies);
  const loading = useSelector((state: RootState) => state.watchlist.loading);

  useEffect(() => {
    console.log(`watchlist ${watchlist}`);
    if (token) {
      dispatch(fetchWatchlist(token));
    }
  }, [dispatch, token]);

  const handleRemoveMovie = (movieID: number) => {
    dispatch(removeMovieFromWatchlist({ movieID, token }));
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Your Watchlist</h1>
      {watchlist.length === 0 ? (
        <p>Your watchlist is empty.</p>
      ) : (
        <ul className="space-y-4">
          {watchlist.map((movie) => (
            <li
              key={movie.Movie.movieID}
              className="flex items-center justify-between bg-white shadow-md rounded-lg p-4"
            >
              <div className="flex items-center">
                <img
                  src={movie.Movie.thumbnailUrl}
                  alt={movie.Movie.name}
                  className="w-16 h-24 object-cover rounded-lg mr-4"
                />
                <div>
                  <h2 className="text-xl font-semibold">{movie.Movie.name}</h2>
                  <p>{movie.Movie.releaseYear}</p>
                  <p className="text-sm text-gray-500">
                    <p className="inline text-yellow-500">★</p>
                    {movie.Movie.rating}
                  </p>
                </div>
              </div>
              <button
                className={`inline-block bg-transparent text-[#171C20] cursor-pointer border border-gray-700 rounded-full text-xs font-light h-8 tracking-wide max-w-[150px] px-3 text-center uppercase align-middle 
                    hover:bg-red-300 hover:border-red-300 hover:text-gray-700 text-white`}
                onClick={() => handleRemoveMovie(movie.Movie.movieID)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
