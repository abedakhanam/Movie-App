import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const getAllMovies = async (page: number, limit: number) => {
  try {
    const response = await api.get(`/movies?page=${page}&limit=${limit}`);
    console.log("API response:", response.data);
    return response.data.movies;
  } catch (error) {
    console.error("Error fetching movies", error);
    return [];
  }
};

export const getMovieDetails = async (id: number) => {
  try {
    const response = await api.get(`/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching movie details", error);
    throw error;
  }
};

export const postReview = async (
  movieID: number,
  rating: number | null,
  review: string | null,
  token: string | null
) => {
  console.log(
    `mvovieId: ${movieID}, ratong: ${rating}, rev: ${review}`
  );
  // try {
  //   const response = await api.post(
  //     `/${movieID}/review`,
  //     { rating, review },
  //     {
  //       headers: {
  //         Authorization: `Bearer ${token}`, // Send token in Authorization header
  //       },
  //     }
  //   );
  //   return response.data;
  // } catch (error) {
  //   console.error("Error posting review", error);
  //   throw error;
  // }
};
