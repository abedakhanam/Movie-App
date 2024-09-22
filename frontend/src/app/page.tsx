"use client";
import DiscoveryHeader from "@/components/base/DiscoveryHeader";
import { certificate, genre, ratings, type } from "@/components/filter";
import MovieCard from "@/components/MovieCard";
import { getAllMovies } from "@/services/api";
import {
  incrementPage,
  loadMoviesFailure,
  loadMoviesRequest,
  loadMoviesSuccess,
  resetMovies,
} from "@/store/movieSilce";
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
  const [filters, setFilters] = useState({});
  const [initialLoad, setInitialLoad] = useState(true);
  const limit = 20; // Number of movies per request

  const isFetching = useRef(false); //for repeat api call

  const isFetchingWatchlist = useRef(0);

  const fetchMovies = useCallback(
    async (currentPage: number, limit: number, appliedFilters = filters) => {
      if (isFetching.current) return; //prevent dup calls
      isFetching.current = true;
      dispatch(loadMoviesRequest());
      try {
        // console.log(`fetchmocvie filters ${JSON.stringify(appliedFilters)}`);
        const moviesData = await getAllMovies(
          currentPage,
          limit,
          appliedFilters
        );
        // console.log(`moviesData ${JSON.stringify(moviesData)}`);
        dispatch(
          loadMoviesSuccess({
            movies: moviesData,
            hasMore: moviesData.length === limit,
          })
        );
        if (token) {
          if (isFetchingWatchlist.current !== 0) return; //prevent dup calls
          isFetchingWatchlist.current = 1;
          dispatch(fetchWatchlist(token));
          // console.log((await a).payload);
        }
        dispatch(incrementPage());
      } catch (error) {
        dispatch(loadMoviesFailure());
      } finally {
        isFetching.current = false;
      }
    },
    [dispatch, filters]
  );

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
  }, [dispatch, fetchMovies, initialLoad, limit, filters]);

  // Scroll event listener
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore, page]);

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    // console.log(`newfilters ${JSON.stringify(filters)}`);
    dispatch(resetMovies());
    fetchMovies(1, limit, newFilters); // Fetch movies again with new filters
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
      <h1 className="text-2xl font-bold mb-2">Movies List</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {movies.length > 0 ? (
          movies.map((movie) => (
            <MovieCard
              key={movie.movieID}
              movieID={movie.movieID}
              name={movie.name}
              thumbnailUrl={movie.thumbnailUrl}
              rating={movie.rating}
              type={movie.type}
              certificate={movie.certificate}
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

// "use client";
// import DiscoveryHeader from "@/components/base/DiscoveryHeader";
// import { certificate, genre, ratings, type } from "@/components/filter";
// import MovieCard from "@/components/MovieCard";
// import { getAllMovies } from "@/services/api";
// import {
//   incrementPage,
//   loadMoviesFailure,
//   loadMoviesRequest,
//   loadMoviesSuccess,
//   resetMovies,
// } from "@/store/movieSilce";
// import { AppDispatch, RootState } from "@/store/store";
// import { useCallback, useEffect, useRef, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";

// export default function Home() {
//   const dispatch = useDispatch<AppDispatch>();
//   const { movies, page, hasMore, loading } = useSelector(
//     (state: RootState) => state.movies
//   );
//   const [filters, setFilters] = useState({});
//   const [initialLoad, setInitialLoad] = useState(true);

//   const limit = 20; // Number of movies per request
//   const isFetching = useRef(false); //for repeat api call

//   const fetchMovies = useCallback(
//     async (currentPage: number, limit: number, appliedFilters = filters) => {
//       if (isFetching.current) return; //prevent dup calls
//       isFetching.current = true;
//       dispatch(loadMoviesRequest());
//       try {
//         console.log(`fetchmocvie filters ${JSON.stringify(appliedFilters)}`);
//         const moviesData = await getAllMovies(currentPage, limit, appliedFilters);
//         dispatch(
//           loadMoviesSuccess({
//             movies: moviesData,
//             hasMore: moviesData.length === limit,
//           })
//         );
//         dispatch(incrementPage());
//       } catch (error) {
//         dispatch(loadMoviesFailure());
//       } finally {
//         isFetching.current = false;
//       }
//     },
//     [dispatch, filters]
//   );

//   const handleScroll = useCallback(() => {
//     if (
//       window.innerHeight + document.documentElement.scrollTop >=
//         document.documentElement.offsetHeight - 200 &&
//       !loading &&
//       hasMore
//     ) {
//       fetchMovies(page, limit);
//     }
//   }, [fetchMovies, loading, hasMore, page, limit]);

//   // Initial fetch of movies when the component mounts
//   useEffect(() => {
//     if (initialLoad) {
//       dispatch(resetMovies());
//       fetchMovies(1, limit);
//       setInitialLoad(false);
//     }
//   }, [dispatch, fetchMovies, initialLoad, limit, filters]);

//   // Scroll event listener
//   useEffect(() => {
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, [loading, hasMore, page]);

//   const handleFilterChange = (newFilters: any) => {
//     setFilters(newFilters);
//     // console.log(`newfilters ${JSON.stringify(filters)}`);
//     dispatch(resetMovies());
//     fetchMovies(1, limit, newFilters); // Fetch movies again with new filters
//   };

//   return (
//     <div className="p-4">
//       <DiscoveryHeader
//         genre={genre}
//         ratings={ratings}
//         type={type}
//         certificate={certificate}
//         onFilterChange={handleFilterChange}
//       />
//       <h1 className="text-3xl font-bold mb-6">Movies List</h1>
//       <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
//         {movies.length > 0 ? (
//           movies.map((movie) => (
//             <MovieCard
//               key={movie.movieID}
//               movieID={movie.movieID}
//               name={movie.name}
//               thumbnailUrl={movie.thumbnailUrl}
//             />
//           ))
//         ) : (
//           <p>No movies available</p>
//         )}
//       </div>
//       {loading && <p>Loading more movies...</p>}
//       {/* Loader element to trigger infinite scroll */}
//     </div>
//   );
// }
