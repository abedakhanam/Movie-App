"use client";
import DiscoveryHeader from "@/components/base/DiscoveryHeader";
import MovieCard from "@/components/MovieCard";
import { getAllMovies } from "@/services/api";
import {
  incrementPage,
  loadMoviesFailure,
  loadMoviesRequest,
  loadMoviesSuccess,
  resetMovies,
} from "@/store/movieSilce";
import { AppDispatch, RootState, store } from "@/store/store";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

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
  const dispatch = useDispatch<AppDispatch>();
  const { movies, page, hasMore, loading } = useSelector(
    (state: RootState) => state.movies
  );
  const [initialLoad, setInitialLoad] = useState(true);

  const limit = 20; // Number of movies per request

  const fetchMovies = useCallback(
    async (currentPage: number, limit: number) => {
      dispatch(loadMoviesRequest());
      try {
        const moviesData = await getAllMovies(currentPage, limit);
        dispatch(
          loadMoviesSuccess({
            movies: moviesData,
            hasMore: moviesData.length === limit,
          })
        );
        dispatch(incrementPage());
      } catch (error) {
        dispatch(loadMoviesFailure());
      }
    },
    [dispatch]
  );

  // const fetchMovies = async (page: number, limit: number) => {
  //   dispatch(loadMoviesRequest());
  //   try {
  //     const moviesData = await getAllMovies(page, limit);
  //     dispatch(
  //       loadMoviesSuccess({
  //         movies: moviesData,
  //         hasMore: moviesData.length > 0,
  //       })
  //     );
  //     dispatch(incrementPage());
  //   } catch (error) {
  //     dispatch(loadMoviesFailure());
  //   }
  // };

  // const handleScroll = () => {
  //   if (
  //     window.innerHeight + document.documentElement.scrollTop >=
  //       document.documentElement.offsetHeight &&
  //     !loading &&
  //     hasMore
  //   ) {
  //     // Calculate offset based on the current page and limit
  //     fetchMovies(page, limit);
  //   }
  // };

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 200 &&
      !loading &&
      hasMore
    ) {
      fetchMovies(page, limit);
    }
  }, [fetchMovies, loading, hasMore, page, limit]);

  // Initial fetch of movies when the component mounts
  useEffect(() => {
    if (initialLoad) {
      dispatch(resetMovies());
      fetchMovies(1, limit);
      setInitialLoad(false);
    }
  }, [dispatch, fetchMovies, initialLoad, limit]);

  // Scroll event listener
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore, page]);

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
      {/* Loader element to trigger infinite scroll */}
    </div>
  );
}
