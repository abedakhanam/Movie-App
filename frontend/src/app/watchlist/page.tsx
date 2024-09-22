"use client";

import timeAgo from "@/services/date";
import { AppDispatch, RootState } from "@/store/store";
import {
  fetchWatchlist,
  removeMovieFromWatchlist,
} from "@/store/watchlistSlice";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function WatchlistPage() {
  const dispatch = useDispatch<AppDispatch>();
  const token = useSelector((state: RootState) => state.user.token);
  const watchlist = useSelector((state: RootState) => state.watchlist.movies);
  const loading = useSelector((state: RootState) => state.watchlist.loading);
  const isFetching = useRef(false);

  useEffect(() => {
    // console.log(`watchlist ${watchlist}`);
    if (token) {
      if (isFetching.current) return;
      dispatch(fetchWatchlist(token));
      isFetching.current = true;
    }
  }, [dispatch, token]);

  const handleRemoveMovie = (movieID: number) => {
    if (token) {
      dispatch(removeMovieFromWatchlist({ movieID, token }));
    }
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
              key={movie.movieID}
              className="flex items-center justify-between bg-white shadow-md rounded-lg p-4"
            >
              {movie.Movie ? (
                <>
                  <div className="flex items-center">
                    <img
                      src={movie.Movie.thumbnailUrl || "/placeholder-image.jpg"}
                      alt={movie.Movie.name || "Movie"}
                      className="w-16 h-24 object-cover rounded-lg mr-4"
                    />
                    <div>
                      <h2 className="text-xl font-semibold">
                        {movie.Movie.name || "Unknown Title"}
                      </h2>
                      <p>{movie.Movie.releaseYear || "N/A"}</p>
                      <p className="text-sm text-gray-500">
                        <span className="inline text-yellow-500">★</span>
                        {movie.Movie.rating || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <button
                      className={`inline-block bg-transparent text-[#171C20] cursor-pointer border border-gray-700 rounded-full text-xs font-light h-8 tracking-wide max-w-[150px] px-3 text-center uppercase align-middle 
                        hover:bg-red-300 hover:border-red-300 hover:text-gray-700`}
                      onClick={() => handleRemoveMovie(movie.movieID)}
                    >
                      Remove
                    </button>
                    <p className="text-xs mt-10">{timeAgo(movie.dateAdded)}</p>
                  </div>
                </>
              ) : (
                <p>Loading movie details...</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
