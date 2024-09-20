// components/MovieCard.tsx
import { useRouter } from "next/navigation";
import React from "react";

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
    </div>
  );
};

export default MovieCard;
