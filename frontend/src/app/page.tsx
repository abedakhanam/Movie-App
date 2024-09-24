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
  const searchQuery = useSelector(
    (state: RootState) => state.movies.searchQuery
  );
  const [filters, setFilters] = useState({});
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
        let moviesData;
        if (searchQuery.trim() === "") {
          moviesData = await getAllMovies(currentPage, limit, appliedFilters);
        } else {
          moviesData = await getAllMovies(currentPage, limit, {
            ...appliedFilters,
            search: searchQuery,
          });
        }
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
    [dispatch, filters, searchQuery]
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
    dispatch(resetMovies());
    fetchMovies(1, limit);
  }, [dispatch, fetchMovies, limit, filters, searchQuery]);

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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
        {movies.length > 0 ? (
          movies.map((movie) => (
            <div className="hover:shadow-lg transition-shadow duration-300 ease-in-out transform hover:scale-105">
              <MovieCard
                key={movie.movieID}
                movieID={movie.movieID}
                name={movie.name}
                thumbnailUrl={movie.thumbnailUrl}
                rating={movie.rating}
                type={movie.type}
                certificate={movie.certificate}
              />
            </div>
          ))
        ) : (
          <p className="text-center text-lg font-medium">No movies available</p>
        )}
      </div>
      {loading && <p>Loading more movies...</p>}
      {/* Loader element to trigger infinite scroll */}
    </div>
  );
}

//
//
//
//
//
//
//
//
//fixing search
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
// import { fetchWatchlist } from "@/store/watchlistSlice";
// import { useCallback, useEffect, useRef, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";

// export default function Home() {
//   const dispatch = useDispatch<AppDispatch>();
//   const { movies, page, hasMore, loading } = useSelector(
//     (state: RootState) => state.movies
//   );
//   const token = useSelector((state: RootState) => state.user.token);
//   const searchQuery = useSelector(
//     (state: RootState) => state.movies.searchQuery
//   );
//   const [filters, setFilters] = useState({});
//   const limit = 20; // Number of movies per request

//   const isFetching = useRef(false); //for repeat api call

//   const isFetchingWatchlist = useRef(0);

//   const fetchMovies = useCallback(
//     async (currentPage: number, limit: number, appliedFilters = filters) => {
//       if (isFetching.current) return; //prevent dup calls
//       isFetching.current = true;
//       dispatch(loadMoviesRequest());
//       try {
//         // console.log(`fetchmocvie filters ${JSON.stringify(appliedFilters)}`);
//         const moviesData = await getAllMovies(currentPage, limit, {
//           ...appliedFilters,
//           search: searchQuery,
//         });
//         // console.log(`moviesData ${JSON.stringify(moviesData)}`);
//         dispatch(
//           loadMoviesSuccess({
//             movies: moviesData,
//             hasMore: moviesData.length === limit,
//           })
//         );
//         if (token) {
//           if (isFetchingWatchlist.current !== 0) return; //prevent dup calls
//           isFetchingWatchlist.current = 1;
//           dispatch(fetchWatchlist(token));
//           // console.log((await a).payload);
//         }
//         dispatch(incrementPage());
//       } catch (error) {
//         dispatch(loadMoviesFailure());
//       } finally {
//         isFetching.current = false;
//       }
//     },
//     [dispatch, filters, searchQuery]
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
//     dispatch(resetMovies());
//     fetchMovies(1, limit);
//   }, [dispatch, fetchMovies, limit, filters, searchQuery]);

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
//       <div className="mb-4">
//         <DiscoveryHeader
//           genre={genre}
//           ratings={ratings}
//           type={type}
//           certificate={certificate}
//           onFilterChange={handleFilterChange}
//         />
//       </div>
//       <h1 className="text-2xl font-bold mb-2">Movies List</h1>
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
//         {movies.length > 0 ? (
//           movies.map((movie) => (
//             <div className="hover:shadow-lg transition-shadow duration-300 ease-in-out transform hover:scale-105">
//               <MovieCard
//                 key={movie.movieID}
//                 movieID={movie.movieID}
//                 name={movie.name}
//                 thumbnailUrl={movie.thumbnailUrl}
//                 rating={movie.rating}
//                 type={movie.type}
//                 certificate={movie.certificate}
//               />
//             </div>
//           ))
//         ) : (
//           <div className="flex justify-center items-center h-screen fixed top-0 left-0 right-0 bottom-0 w-full z-50">
//             <div role="status">
//               <svg
//                 aria-hidden="true"
//                 className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
//                 viewBox="0 0 100 101"
//                 fill="none"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
//                   fill="currentColor"
//                 />
//                 <path
//                   d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
//                   fill="currentFill"
//                 />
//               </svg>
//               <span className="sr-only">Loading...</span>
//             </div>
//           </div>
//         )}
//       </div>
//       {/* {loading && <p>Loading more movies...</p>} */}
//       {/* Loader element to trigger infinite scroll */}
//     </div>
//   );
// }
