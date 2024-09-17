import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const getAllMovies = async () => {
  try {
    const response = await api.get("/");
    console.log("API response:", response.data);
    return response.data.allMovies;
  } catch (error) {
    console.error("Error fetching movies", error);
    return [];
  }
};
