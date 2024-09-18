"use client";
import DiscoveryHeader from "@/components/base/DiscoveryHeader";
import MovieCard from "@/components/MovieCard";
import { getAllMovies } from "@/services/api";
import { useEffect, useState } from "react";

interface Movie {
  movieID: number;
  name: string;
  thumbnailUrl: string;
}

//for now
const genre = [
  { label: "Action", value: "action" },
  { label: "Comedy", value: "comedy" },
  // Add more categories
];
const ratings = [
  { label: "5 Stars", value: "5" },
  { label: "4 Stars", value: "4" },
  // Add more ratings
];

const type = [
  { label: "5 Stars", value: "5" },
  { label: "4 Stars", value: "4" },
  // Add more ratings
];

const certificate = [
  { label: "5 Stars", value: "5" },
  { label: "4 Stars", value: "4" },
  // Add more ratings
];

export default function Home() {
  //will fix later
  const [filters, setFilters] = useState<{
    genre?: string;
    rating?: string;
    type?: string;
    certificate?: string;
  }>({});

  const handleFilterChange = (updatedFilters: {
    genre?: string;
    rating?: string;
    type?: string;
    certificate?: string;
  }) => {
    setFilters(updatedFilters);

    // Make API call to fetch filtered data from the backend
    // Example: axios.get('/api/movies', { params: updatedFilters });
  };
  //upto here

  const [movies, setMovies] = useState<Movie[]>([]);
  useEffect(() => {
    const fetchMovies = async () => {
      const moviesData = await getAllMovies();
      setMovies(moviesData);
    };
    fetchMovies();
  }, []);

  return (
    <div className="p-4">
      <DiscoveryHeader
        genre={genre}
        ratings={ratings}
        type={type}
        certificate={certificate}
      />
      <h1 className="text-3xl font-bold mb-6">Movies List</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.isArray(movies) && movies.length > 0 ? (
          movies.map((movie) => (
            <MovieCard
              key={movie.movieID}
              movieID={movie.movieID}
              name={movie.name}
              thumbnailUrl={movie.thumbnailUrl}
            />
          ))
        ) : (
          <p>No movies available</p>
        )}
      </div>
    </div>
  );
}
