import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const getAllMovies = async (
  page: number,
  limit: number,
  filters: {
    genre?: string;
    rating?: string;
    type?: string;
    certificate?: string;
    search?: string;
  }
) => {
  try {
    // Filter out undefined or empty values from filters
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      ...Object.fromEntries(
        Object.entries(filters).filter(
          ([_, value]) => value !== undefined && value !== ""
        )
      ),
    });

    //console.log(`Fetching movies with params: ${params}`);
    const response = await api.get(`/movies?${params.toString()}`);

    // Assuming the API returns the movies in `response.data.movies`
    // console.log(`Fetching movies with params: ${JSON.stringify(response.data.movies)}`);
    return response.data.movies;
  } catch (error) {
    console.error("Error fetching movies", error);
    return [];
  }
};

export const getMovieDetails = async (id: number) => {
  try {
    const response = await api.get(`/movie/${id}`);
    // console.log(`getmoviedetails ${JSON.stringify(response)}`);
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
  try {
    // Construct payload dynamically based on what's provided
    const payload: { rating?: number; review?: string | null } = {};
    if (rating !== null) {
      payload.rating = rating;
    }
    if (review !== null && review.trim() !== "") {
      payload.review = review;
    }
    const response = await api.post(`/${movieID}/review`, payload, {
      headers: {
        Authorization: `Bearer ${token}`, // Send token in Authorization header
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error posting review", error);
    throw error;
  }
};

export const deleteReview = async (
  movieID: number,
  reviewID: number,
  token: string | null
) => {
  try {
    const response = await api.delete(`/${movieID}/review`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: { reviewID }, // Pass the reviewID in the request body
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting review", error);
    throw error;
  }
};

//add to watchlist
export const addToWatchList = async (movieID: number, token: string | null) => {
  try {
    const response = await api.post(
      "/watchlist",
      { movieID },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding to watchlist", error);
    throw error;
  }
};

//delete
export const deleteFromWatchList = async (
  movieID: number,
  token: string | null
) => {
  try {
    const response = await api.delete(`/watchlist/${movieID}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting from watchlist", error);
    throw error;
  }
};

// get all movies from watchlist
// Get all movies in the watchlist
export const getWatchList = async (token: string | null) => {
  const response = await api.get("/watchlist", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.movies;
};
