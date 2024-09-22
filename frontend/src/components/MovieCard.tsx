import { addToWatchList } from "@/services/api";
import { RootState } from "@/store/store";
import { useRouter } from "next/navigation";
import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";

interface MovieCardProps {
  movieID: number;
  name: string;
  thumbnailUrl: string;
}

const MovieCard: React.FC<MovieCardProps> = ({
  movieID,
  name,
  thumbnailUrl,
}) => {
  const router = useRouter();
  const token = useSelector((state: RootState) => state.user.token);
  const [inWatchList, setInWatchList] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  // const isFetching = useRef(false);
  const handleWatchlistToggle = async () => {
    if (!token) {
      router.push("/login");
    } else {
      if (inWatchList) {
        // await deleteFromWatchList(movieID);
        setInWatchList(false);
      } else {
        await addToWatchList(movieID, token); // Add to watchlist
        setInWatchList(true);
      }
    }

    try {
    } catch (error) {
      console.error("Error fetching movie details", error);
    }
  };
  const goToDetails = () => {
    router.push(`/movies/${movieID}`);
  };
  return (
    <div
      key={movieID}
      onClick={goToDetails}
      className="bg-white rounded-lg shadow-md p-4"
    >
      <img
        src={thumbnailUrl}
        alt={name}
        className="w-full h-64 object-cover rounded-md mb-4"
      />
      <h2 className="text-xl font-semibold">{name}</h2>
      <div className="flex justify-center w-full">
        <button
          onClick={handleWatchlistToggle}
          className={`inline-block bg-transparent text-[#171C20] cursor-pointer border border-gray-700 rounded-full text-xs font-light h-8 tracking-wide max-w-[150px] px-3 text-center uppercase align-middle 
  hover:bg-gray-100 hover:border-gray-200 hover:text-gray-700 ${
    inWatchList ? "bg-red-500" : "bg-blue-500"
  }`}
        >
          {inWatchList ? "Remove from Watchlist" : "Add to Watchlist"}
        </button>
      </div>
    </div>
  );
};

export default MovieCard;
