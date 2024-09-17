// "use client";
// import { getAllMovies } from "@/services/api";
// import { useEffect, useState } from "react";

// interface Movie {
//   movieID: number;
//   name: string;
//   thumbnailUrl: string;
// }

// export default function AllMovie() {
//   const [movies, setMovies] = useState<Movie[]>([]);
//   useEffect(() => {
//     const fetchMovies = async () => {
//       const moviesData = await getAllMovies();
//       setMovies(moviesData);
//     };
//     fetchMovies();
//   }, []);

//   console.log(movies);

//   return (
//     <div className="p-4">
//       <h1 className="text-3xl font-bold mb-6">Movies List</h1>
//       <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
//         {Array.isArray(movies) && movies.length > 0 ? (
//           movies.map((movie) => (
//             <div
//               key={movie.movieID}
//               className="bg-white rounded-lg shadow-md p-4"
//             >
//               <img
//                 src={movie.thumbnailUrl}
//                 alt={movie.name}
//                 className="w-full h-64 object-cover rounded-md mb-4"
//               />
//               <h2 className="text-xl font-semibold">{movie.name}</h2>
//             </div>
//           ))
//         ) : (
//           <p>No movies available</p>
//         )}
//       </div>
//     </div>
//   );
// }
