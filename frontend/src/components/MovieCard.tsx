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
      className="bg-white rounded-lg shadow-md p-4 h-full flex flex-col justify-between"
    >
      <div onClick={goToDetails} className="cursor-pointer">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-64 object-cover rounded-md mb-4"
        />
        <h2 className="text-xl font-semibold">{name}</h2>
        <div className="flex justify-between items-center text-sm p-1">
          <p className="flex items-center bg-gray-100 rounded-3xl p-1">
            <span className="inline text-yellow-500">★</span> {rating}
          </p>
          <div className="flex space-x-4">
            <p className="bg-gray-100 rounded-3xl p-1">{type}</p>
            <p className="bg-gray-100 rounded-3xl p-1">{certificate}</p>
          </div>
        </div>
      </div>
      <div className="flex justify-center w-full mt-auto">
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent navigation when clicking the button
            handleWatchlistToggle(e);
          }}
          className={`w-full max-w-[150px] h-8 text-xs font-light tracking-wide text-center uppercase align-middle rounded-full px-3 
        border cursor-pointer
        ${
          isInWatchlist
            ? "bg-red-300 border-red-500 text-white"
            : "bg-transparent text-[#171C20] border-gray-700 hover:bg-gray-100 hover:border-gray-200 hover:text-gray-700"
        }`}
        >
          {isInWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
        </button>
      </div>
    </div>
  );
};

export default MovieCard;
