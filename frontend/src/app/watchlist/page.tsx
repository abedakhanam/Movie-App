"use client";

import timeAgo from "@/services/date";
import { AppDispatch, RootState } from "@/store/store";
import {
  fetchWatchlist,
  removeMovieFromWatchlist,
} from "@/store/watchlistSlice";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function WatchlistPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
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
    } else {
      router.push("/login");
      return;
    }
  }, [dispatch, token]);

  const handleRemoveMovie = (e: any, movieID: number) => {
    e.stopPropagation(); // Prevent navigation
    if (token) {
      dispatch(removeMovieFromWatchlist({ movieID, token }));
      toast.success("Movie removed from watchlist!");
    }
  };

  const goToDetails = (id: any) => {
    router.push(`/movies/${id}`);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <ToastContainer autoClose={1000} />
      <h1 className="text-3xl font-bold mb-6 text-white">Your Watchlist</h1>
      {watchlist.length === 0 ? (
        <p className="text-lg text-gray-500">Your watchlist is empty.</p>
      ) : (
        <ul className="space-y-6">
          {watchlist.map((movie) => (
            <li
              key={movie.movieID}
              onClick={() => goToDetails(movie.movieID)}
              className="flex items-center justify-between bg-gray-300 shadow-lg hover:shadow-xl rounded-lg p-5 transition-shadow duration-300 ease-in-out"
            >
              {movie.Movie ? (
                <>
                  <div className="flex items-center">
                    <img
                      src={
                        movie.Movie.thumbnailUrl.startsWith("http")
                          ? movie.Movie.thumbnailUrl
                          : `http://localhost:5000${movie.Movie.thumbnailUrl}`
                      }
                      alt={movie.Movie.name || "Movie"}
                      className="w-16 h-24 object-cover rounded-lg mr-5 shadow-md hover:scale-105 transition-transform duration-300"
                    />
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800">
                        {movie.Movie.name || "Unknown Title"}
                      </h2>
                      <p className="text-gray-600">
                        {movie.Movie.releaseYear || "N/A"}
                      </p>
                      <p className="text-sm text-gray-500">
                        <span className="inline text-yellow-500">★</span>
                        {movie.Movie.rating || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <button
                      className={`inline-block bg-transparent text-[#171C20] cursor-pointer border border-gray-700 rounded-full text-xs font-light h-8 px-4 text-center uppercase align-middle 
                    hover:bg-red-300 hover:border-red-300 hover:text-gray-700 transition-all duration-300`}
                      onClick={(e) => handleRemoveMovie(e, movie.movieID)}
                    >
                      Remove
                    </button>
                    <p className="text-xs mt-5 text-gray-400">
                      {timeAgo(movie.dateAdded)}
                    </p>
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
