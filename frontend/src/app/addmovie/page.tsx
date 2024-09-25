"use client";

import {
  createMovie,
  deleteMovie,
  getUserMovies,
  updateMovie,
} from "@/services/api";
import { RootState } from "@/store/store";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type MovieForm = {
  name: string;
  releaseYear: number;
  rating: number;
  votes: number;
  duration: number;
  description: string;
  type: "Film" | "Series";
  certificate: "R" | "PG-13";
  thumbnail: FileList;
  genre: string;
};

type Movie = {
  //for get movies
  movieID: number;
  name: string;
  releaseYear: number;
  rating: number;
  votes: number;
  duration: number;
  description: string;
  type: "Film" | "Series";
  certificate: "R" | "PG-13";
  thumbnailUrl: string;
};

export default function CreateMovie() {
  const router = useRouter();
  const token = useSelector((state: RootState) => state.user.token);
  const { register, handleSubmit, reset } = useForm<MovieForm>();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingMovieID, setEditingMovieID] = useState<number | null>(null);
  const isFetching = useRef(false);
  // Fetch all user movies
  useEffect(() => {
    async function fetchMovies() {
      if (isFetching.current) return;
      try {
        isFetching.current = true;
        const userMovies = await getUserMovies(token);
        setMovies(userMovies || []);
      } catch (error) {
        console.error("Error fetching user movies:", error);
        toast.error("Error fetching user movies");
      } finally {
        setLoading(false);
        isFetching.current = false;
      }
    }
    fetchMovies();
  }, [token]);

  // Submit movie form
  const onSubmit = async (data: MovieForm) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("releaseYear", data.releaseYear.toString());
    formData.append("rating", data.rating.toString());
    formData.append("votes", data.votes.toString());
    formData.append("duration", data.duration.toString());
    formData.append("description", data.description);
    formData.append("type", data.type);
    formData.append("certificate", data.certificate);
    formData.append("thumbnail", data.thumbnail[0]);
    formData.append("genres", data.genre);

    try {
      setError(null);
      if (editingMovieID) {
        // If editing, update movie
        await updateMovie(editingMovieID, formData, token);
        toast.success("Movie updated successfully!");
      } else {
        // Create a new movie
        const newMovie = await createMovie(formData, token);
        setMovies((prevMovies) => [...prevMovies, newMovie]);
        toast.success("Movie created successfully!");
      }
      reset();
      setEditingMovieID(null);
    } catch (error) {
      toast.error("Error while creating/updating movie");
    }
  };

  // Handle delete movie
  const handleDelete = async (e: any, id: number) => {
    e.stopPropagation(); // Prevent navigation
    try {
      const m = await deleteMovie(id, token);
      if (m) {
        setMovies(movies.filter((movie) => movie.movieID !== id));
      }
      toast.success("Movie deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete movie");
    }
  };

  // Handle edit movie
  const handleEdit = (e: any, movie: Movie) => {
    e.stopPropagation(); // Prevent navigation
    setEditingMovieID(movie.movieID);
    reset(movie);

    window.scrollTo({
      top: 0, // Scroll to the top of the page
      behavior: "smooth", // smooth scrolling effect
    });
  };

  const goToDetails = (id: any) => {
    router.push(`/movies/${id}`);
  };

  return (
    <div className="container mx-auto p-4">
      <ToastContainer autoClose={1000} /> {/* Toast container */}
      <h1 className="text-2xl font-bold mb-6">Create Movie</h1>
      <div>
        {/* Movie Creation Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 bg-white p-6 shadow-lg rounded-lg"
        >
          {/* Form fields */}
          <div>
            <label className="block mb-2 text-gray-600">Movie Name</label>
            <input
              {...register("name", { required: true })}
              className="border p-2 w-full rounded-md"
              type="text"
            />
          </div>
          <div>
            <label className="block mb-2">Release Year</label>
            <input
              {...register("releaseYear", { required: true })}
              className="border p-2 w-full"
              type="number"
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-600">Rating (1-10)</label>
            <input
              {...register("rating", { required: true, min: 1, max: 10 })}
              className="border p-2 w-full"
              type="number"
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-600">Votes</label>
            <input
              {...register("votes")}
              className="border p-2 w-full"
              type="number"
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-600">
              Duration (in minutes)
            </label>
            <input
              {...register("duration")}
              className="border p-2 w-full"
              type="number"
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-600">Description</label>
            <textarea
              {...register("description")}
              className="border p-2 w-full"
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-600">Type</label>
            <select
              {...register("type", { required: true })}
              className="border p-2 w-full"
            >
              <option value="Film">Film</option>
              <option value="Series">Series</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 text-gray-600">Genre</label>
            <select
              {...register("genre", { required: true })}
              className="border p-2 w-full"
            >
              <option value="1">Action</option>
              <option value="2">Adventure</option>
              <option value="3">Thriller</option>
              <option value="4">Crime</option>
              <option value="5">Drama</option>
              <option value="6">Sci-Fi</option>
              <option value="7">Comedy</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 text-gray-600">Certificate</label>
            <select
              {...register("certificate", { required: true })}
              className="border p-2 w-full"
            >
              <option value="R">R</option>
              <option value="PG-13">PG-13</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 text-gray-600">Thumbnail</label>
            <input
              {...register("thumbnail")}
              className="border p-2 w-full"
              type="file"
              accept="image/*"
            />
          </div>

          {/* Error or Success Messages */}
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {success && <p className="text-green-500 mb-4">{success}</p>}

          <button className="bg-blue-500 text-white p-2 rounded" type="submit">
            {editingMovieID ? "Update Movie" : "Create Movie"}
          </button>
        </form>
      </div>
      <div className="mt-10">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Your Movies</h2>
        {movies.length > 0 ? (
          <div className="space-y-6">
            {movies.map((movie) => (
              <div
                key={movie.movieID}
                onClick={() => goToDetails(movie.movieID)}
                className="flex items-center justify-between bg-white shadow-lg hover:shadow-xl rounded-lg p-5 transition-shadow duration-300 ease-in-out"
              >
                <div className="flex items-center">
                  {movie.thumbnailUrl ? (
                    <img
                      src={
                        movie.thumbnailUrl.startsWith("http")
                          ? movie.thumbnailUrl
                          : `http://localhost:5000${movie.thumbnailUrl}`
                      }
                      alt={`${movie.name} thumbnail`}
                      className="w-16 h-24 object-cover rounded-lg mr-5 shadow-md hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="no-thumbnail">
                      <p>No Thumbnail Available</p>
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      {movie.name}
                    </h3>
                    <p className="text-gray-600">
                      Release Year: {movie.releaseYear}
                    </p>
                    <p className="text-sm text-gray-500">
                      <span className="inline text-yellow-500">★</span>
                      {movie.rating}/10
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <button
                    onClick={(e) => handleEdit(e, movie)}
                    className="bg-yellow-500 text-white px-4 py-2 mr-2 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => handleDelete(e, movie.movieID)}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No movies created yet.</p>
        )}
      </div>
    </div>
  );
}
