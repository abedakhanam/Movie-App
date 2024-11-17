import { RootState, AppDispatch } from "@/store/store";
import {
  addMovieToWatchlist,
  removeMovieFromWatchlist,
} from "@/store/watchlistSlice";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

interface MovieCardProps {
  movieID: number;
  name: string;
  thumbnailUrl: string;
  rating: number;
  type: string;
  certificate: string;
}

const MovieCard: React.FC<MovieCardProps> = ({
  movieID,
  name,
  thumbnailUrl,
  rating,
  type,
  certificate,
}) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const token = useSelector((state: RootState) => state.user.token);
  const reduxWatchlist = useSelector(
    (state: RootState) => state.watchlist.movies
  );

  // Use local state to track if the movie is in the watchlist
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  // Update local state when Redux state changes
  useEffect(() => {
    setIsInWatchlist(reduxWatchlist.some((movie) => movie.movieID === movieID));
  }, [reduxWatchlist, movieID]);

  const handleWatchlistToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!token) {
      router.push("/login");
      return;
    }
    try {
      if (isInWatchlist) {
        await dispatch(removeMovieFromWatchlist({ movieID, token })).unwrap();
      } else {
        await dispatch(addMovieToWatchlist({ movieID, token })).unwrap();
      }
      // Toggle the local state immediately
      setIsInWatchlist(!isInWatchlist);
    } catch (error) {
      console.error("Error updating watchlist:", error);
      // Optionally, revert the local state if the API call fails
      setIsInWatchlist(
        reduxWatchlist.some((movie) => movie.movieID === movieID)
      );
    }
  };

  const goToDetails = () => {
    router.push(`/movies/${movieID}`);
  };

  // Prepend the backend URL to local images
  const imageUrl = thumbnailUrl.startsWith("http")
    ? thumbnailUrl
    : `http://localhost:5000${thumbnailUrl}`;

  return (
    <div
      key={movieID}
      className="relative bg-white rounded-lg shadow-md overflow-hidden"
    >
      <div onClick={goToDetails} className="cursor-pointer">
        <div className="relative">
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-[400px] object-cover"
          />
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent navigation when clicking the button
              handleWatchlistToggle(e);
            }}
            className={`absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1 border-2
    ${
      isInWatchlist
        ? "bg-red-300 border-red-500 text-white hover:bg-red-400"
        : "bg-transparent text-[#171C20] border-white hover:bg-gray-100 hover:border-gray-200 hover:text-gray-700"
    }`}
          >
            {isInWatchlist ? "-" : "+"}
          </button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
          <h2 className="text-xl font-semibold text-white mb-2">{name}</h2>
          <div className="flex justify-between items-center text-sm">
            {rating > 0 && (
              <p className="flex items-center bg-yellow-500 bg-opacity-75 text-white rounded-full px-2 py-1">
                <span className="mr-1">★</span> {rating.toFixed(1)}
              </p>
            )}
            <div className="flex space-x-2 ml-auto">
              <p className="bg-gray-800 bg-opacity-75 text-white rounded-full px-2 py-1">
                {type}
              </p>
              <p className="bg-gray-800 bg-opacity-75 text-white rounded-full px-2 py-1">
                {certificate}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;