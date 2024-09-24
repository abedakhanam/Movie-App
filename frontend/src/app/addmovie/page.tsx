// "use client";
// export default function AddMovie() {}
"use client";

import {
  createMovie,
  deleteMovie,
  getUserMovies,
  updateMovie,
} from "@/services/api";
import { RootState } from "@/store/store";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
// import Image from "next/image";

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
      } finally {
        setLoading(false);
        isFetching.current = false;
      }
    }
    fetchMovies();
  }, [token]);

  const array = [1, 2];

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
      if (editingMovieID) {
        // If editing, update movie
        await updateMovie(editingMovieID, formData, token);
      } else {
        // Create a new movie
        const newMovie = await createMovie(formData, token);
        setMovies((prevMovies) => [...prevMovies, newMovie]);
      }
      reset();
      setEditingMovieID(null);
    } catch (error) {
      console.error("Error submitting movie:", error);
    }
  };

  // Handle delete movie
  const handleDelete = async (id: number) => {
    try {
      await deleteMovie(id, token);
      setMovies(movies.filter((movie) => movie.movieID !== id));
    } catch (error) {
      console.error("Error deleting movie:", error);
    }
  };

  // Handle edit movie
  const handleEdit = (movie: Movie) => {
    setEditingMovieID(movie.movieID);
    reset(movie);
  };

  return (
    <div className="container mx-auto p-4">
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
                    onClick={() => handleEdit(movie)}
                    className="bg-yellow-500 text-white px-4 py-2 mr-2 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(movie.movieID)}
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
