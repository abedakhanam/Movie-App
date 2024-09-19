import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const getAllMovies = async (page = 1, limit = 20) => {
  try {
    const response = await api.get("?page=${page}&limit=${limit}");
    console.log("API response:", response.data);
    return response.data.movies;
  } catch (error) {
    console.error("Error fetching movies", error);
    return [];
  }
};
