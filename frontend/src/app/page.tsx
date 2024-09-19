"use client";
import DiscoveryHeader from "@/components/base/DiscoveryHeader";
import MovieCard from "@/components/MovieCard";
import { getAllMovies } from "@/services/api";
import { useCallback, useEffect, useRef, useState } from "react";

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
  { label: "Type 1", value: "type1" },
  { label: "Type 2", value: "type2" },
  // Add more ratings
];

const certificate = [
  { label: "Certificate 1", value: "cert1" },
  { label: "Certificate 2", value: "cert2" },
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
  const [page, setPage] = useState(1); // Current page for pagination
  const [hasMore, setHasMore] = useState(true); // To track if there are more movies to load
  const [loading, setLoading] = useState(false); // To handle loading state
  const limit = 20; // Number of movies per request
  const loaderRef = useRef(null); // Ref to track the scroll position

  const fetchMovies = async (page: number) => {
    setLoading(true);
    const moviesData = await getAllMovies(page, limit); // Fetch movies with pagination
    if (moviesData.length === 0) {
      setHasMore(false); // If no more movies are fetched, stop further loading
    } else {
      setMovies((prevMovies) => [...prevMovies, ...moviesData]); // Append new movies
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMovies(page);
  }, [page]);

  // Infinite Scroll Logic
  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const target = entries[0];
    if (target.isIntersecting && hasMore && !loading) {
      setPage((prevPage) => prevPage + 1); // Load next page when observer triggers
    }
  }, [hasMore, loading]);

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "20px",
      threshold: 1.0,
    });
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [handleObserver]);

  // useEffect(() => {
  //   const fetchMovies = async () => {
  //     const moviesData = await getAllMovies();
  //     setMovies(moviesData);
  //   };
  //   fetchMovies();
  // }, []);

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
        {movies.length > 0 ? (
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
      {loading && <p>Loading more movies...</p>}
      <div ref={loaderRef}></div> {/* Loader element to trigger infinite scroll */}
    </div>
  );
}
