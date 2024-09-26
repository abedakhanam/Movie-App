"use client";
import DiscoveryHeader from "@/components/base/DiscoveryHeader";
import { certificate, genre, ratings, type } from "@/components/filter";
import LoaderSpinner from "@/components/LoaderSpinner";
import MovieCard from "@/components/MovieCard";
import { fetchMovies, incrementPage, resetMovies } from "@/store/movieSilce";
import { AppDispatch, RootState } from "@/store/store";
import { fetchWatchlist } from "@/store/watchlistSlice";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const { movies, page, hasMore, loading } = useSelector(
    (state: RootState) => state.movies
  );
  const token = useSelector((state: RootState) => state.user.token);
  const searchQuery = useSelector(
    (state: RootState) => state.movies.searchQuery
  );
  const [filters, setFilters] = useState({});
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const limit = 20; // Number of movies per request

  const isFetching = useRef(false); //for repeat api call
  const isFetchingWatchlist = useRef(0);

  const fetchMoviesCallback = useCallback(
    async (currentPage: number, limit: number, appliedFilters = filters) => {
      if (isFetching.current) return; //prevent dup calls
      isFetching.current = true;
      try {
        // console.log(`fetchmocvie filters ${JSON.stringify(appliedFilters)}`);
        const filterParams =
          searchQuery.trim() !== ""
            ? { ...appliedFilters, search: searchQuery }
            : appliedFilters;
        await dispatch(
          fetchMovies({ page: currentPage, limit, filters: filterParams })
        );
        // console.log(`moviesData ${JSON.stringify(moviesData)}`);
        if (token) {
          if (isFetchingWatchlist.current !== 0) return; //prevent dup calls
          isFetchingWatchlist.current = 1;
          dispatch(fetchWatchlist(token));
        }
        dispatch(incrementPage());
      } finally {
        isFetching.current = false;
        setInitialLoadDone(true);
      }
    },
    [dispatch, filters, searchQuery]
  );

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 200 &&
      !loading &&
      hasMore
    ) {
      fetchMoviesCallback(page, limit);
    }
  }, [fetchMoviesCallback, loading, hasMore, page, limit]);

  // Initial fetch of movies when the component mounts
  useEffect(() => {
    setInitialLoadDone(false);
    fetchMoviesCallback(1, limit);
  }, [dispatch, fetchMoviesCallback, limit, filters, searchQuery]);

  // Scroll event listener
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore, page]);

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    // console.log(`newfilters ${JSON.stringify(filters)}`);
    dispatch(resetMovies());
    setInitialLoadDone(false);
    fetchMoviesCallback(1, limit, newFilters); // Fetch movies again with new filters
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <DiscoveryHeader
          genre={genre}
          ratings={ratings}
          type={type}
          certificate={certificate}
          onFilterChange={handleFilterChange}
        />
      </div>
      <h1 className="text-2xl font-bold mb-2 text-white">Movies List</h1>
      {!initialLoadDone ? (
        <div className="flex justify-center items-center h-64">
          <LoaderSpinner />
        </div>
      ) : movies.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 p-4">
          {movies.map((movie) => (
            <div
              key={movie.movieID}
              className="hover:shadow-lg transition-shadow duration-300 ease-in-out transform hover:scale-105"
            >
              <MovieCard
                movieID={movie.movieID}
                name={movie.name}
                thumbnailUrl={movie.thumbnailUrl}
                rating={movie.rating}
                type={movie.type}
                certificate={movie.certificate}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 mt-8">
          No movies available
        </div>
      )}
      <div className="relative mt-8 flex justify-center">
        {loading && movies.length > 0 && <LoaderSpinner />}
      </div>
    </div>
  );
}
