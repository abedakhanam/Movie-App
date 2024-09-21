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
    // console.log(`Fetching movies with params: ${response.data.movies}`);
    return response.data.movies;
  } catch (error) {
    console.error("Error fetching movies", error);
    return [];
  }
};

// export const getAllMovies = async (
//   page: number,
//   limit: number,
//   filters: {
//     genre?: string;
//     rating?: string;
//     type?: string;
//     certificate?: string;
//   }
// ) => {
//   try {
//     // Filter out undefined values
//     const params = new URLSearchParams({
//       page: String(page),
//       limit: String(limit),
//       ...Object.entries(filters)
//         .filter(([_, value]) => value !== undefined && value !== "")
//         .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {}),
//     });
//     console.log(params);
//     const response = await api.get(`/movies?${params.toString()}`);
//     return response.data.movies;
//   } catch (error) {
//     console.error("Error fetching movies", error);
//     return [];
//   }
// };

// export const getAllMovies = async (page: number, limit: number) => {
//   try {
//     const response = await api.get(`/movies?page=${page}&limit=${limit}`);
//     console.log("API response:", response.data);
//     return response.data.movies;
//   } catch (error) {
//     console.error("Error fetching movies", error);
//     return [];
//   }
// };

export const getMovieDetails = async (id: number) => {
  try {
    const response = await api.get(`/movie/${id}`);
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
