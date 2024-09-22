"use client";
import { deleteReview, getMovieDetails, postReview } from "@/services/api";
import { Movie, Review } from "@/services/type";
import { RootState } from "@/store/store";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

const MovieDetails = () => {
  const router = useRouter();
  const params = useParams();
  const movieID = params.id;
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [review, setReview] = useState<string>("");
  const [rating, setRating] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const token = useSelector((state: RootState) => state.user.token);
  const userID = useSelector((state: RootState) => state.user.userID);
  // console.log(token);
  const isFetching = useRef(false); //for repeat api call

  useEffect(() => {
    if (movieID) {
      const fetchMovieDetails = async () => {
        if (isFetching.current) return; //prevent dup calls
        isFetching.current = true;
        try {
          const movieData = await getMovieDetails(Number(movieID));
          // console.log(
          //   `getmoviedetails ${JSON.stringify(movieData.movie.description)}`
          // );
          setMovie(movieData.movie);
        } catch (error) {
          console.error("Error fetching movie details", error);
        } finally {
          setLoading(false);
          isFetching.current = false;
        }
      };
      fetchMovieDetails();
    }
  }, [movieID]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (token == null) {
      router.push("/login");
    }
    // If both rating and review are empty, show an error message
    if (!rating && !review.trim()) {
      setError("Please provide a rating or review.");
      return;
    }
    const reviewContent = review.trim() === "" ? null : review.trim();
    try {
      setError(null);
      setSuccess(null);
      // Submit the review (update or create new one)
      const newOrUpdatedReview = await postReview(
        Number(movieID),
        rating,
        reviewContent,
        token
      );

      // Check if the user already has a review in the state
      if (movie) {
        const existingReviewIndex = movie.Reviews.findIndex(
          (r) => r.userID === userID
        );

        if (existingReviewIndex !== -1) {
          // Update the existing review in the state
          const updatedReviews = [...movie.Reviews];
          updatedReviews[existingReviewIndex] = newOrUpdatedReview;

          setMovie({
            ...movie,
            Reviews: updatedReviews,
          });
        } else {
          // Add new review to the state
          setMovie({
            ...movie,
            Reviews: [...movie.Reviews, newOrUpdatedReview],
          });
        }
      }
      // console.log(newReview);
      setSuccess("Review submitted successfully!");
      setReview("");
      setRating(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteReview = async (reviewID: number, e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      setSuccess(null);
      // Call the delete review API
      await deleteReview(Number(movieID), reviewID, token);

      // Update the movie's review state to remove the deleted review
      if (movie) {
        setMovie({
          ...movie,
          Reviews: movie.Reviews.filter((r) => r.reviewID !== reviewID),
        });
      }
      setSuccess("Review deleted successfully!");
    } catch (error) {
      setError("Failed to delete review");
    }
  };

  if (loading)
    return (
      <p className="flex justify-center items-center h-screen">Loading...</p>
    );
  return movie ? (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <div className="flex items-center space-x-4 mb-4">
        <img
          src={movie.thumbnailUrl}
          alt={movie.name}
          className="w-48 h-auto rounded-lg"
        />
        <div>
          <h1 className="text-4xl font-bold mb-2">
            {movie.name}{" "}
            <span className="text-xl font-normal">({movie.releaseYear})</span>
          </h1>
          <p className="text-sm">{movie.description}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="bg-gray-200 px-4 py-2 rounded-lg">
          <strong>Rating:</strong> {movie.rating}
        </div>
        <div className="bg-gray-200 px-4 py-2 rounded-lg">
          <strong>Votes:</strong> {movie.votes}
        </div>
        <div className="bg-gray-200 px-4 py-2 rounded-lg">
          <strong>Duration:</strong> {movie.duration} minutes
        </div>
        <div className="bg-gray-200 px-4 py-2 rounded-lg">
          <strong>Type:</strong> {movie.type}
        </div>
        <div className="bg-gray-200 px-4 py-2 rounded-lg">
          <strong>Certificate:</strong> {movie.certificate}
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="bg-gray-200 px-4 py-2 rounded-lg">
          <strong>Nudity:</strong> {movie.nudity}
        </div>
        <div className="bg-gray-200 px-4 py-2 rounded-lg">
          <strong>Violence:</strong> {movie.violence}
        </div>
        <div className="bg-gray-200 px-4 py-2 rounded-lg">
          <strong>Profanity:</strong> {movie.profanity}
        </div>
        <div className="bg-gray-200 px-4 py-2 rounded-lg">
          <strong>Alcohol:</strong> {movie.alcohol}
        </div>
        <div className="bg-gray-200 px-4 py-2 rounded-lg">
          <strong>Frightening:</strong> {movie.frightening}
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4">Reviews</h2>

      {movie.Reviews.length > 0 ? (
        movie.Reviews.map((review) => (
          <div
            key={review.reviewID}
            className="bg-gray-100 p-4 rounded-lg mb-4"
          >
            <p className="font-bold">User {review.userID}:</p>
            <p>{review.review}</p>
            <div className="flex justify-between mt-2">
              <p className="text-sm">
                <strong>Rating:</strong> {review.rating}/10
              </p>
              <p className="text-sm">
                <strong>Date:</strong>
                {new Date(review.createdAt).toLocaleString()}
              </p>
              {review.userID === userID && (
                <button
                  onClick={(e) => handleDeleteReview(review.reviewID, e)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))
      ) : (
        <p>No reviews available for this movie.</p>
      )}
      <div className="w-full max-w-lg p-4 bg-white rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Leave a Review</h2>

        {/* Rating Selection */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <p className="mb-2">Rating:</p>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`text-2xl ${
                    rating && star <= rating
                      ? "text-yellow-500"
                      : "text-gray-300"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          {/* Review Textarea */}
          <div className="mb-4">
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Write your review..."
              className="w-full p-2 border border-gray-300 rounded-lg"
              rows={4}
            />
          </div>

          {/* Error or Success Messages */}
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {success && <p className="text-green-500 mb-4">{success}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full max-w-[150px] h-8 text-xs font-light tracking-wide text-center uppercase align-middle rounded-full px-3 
              border cursor-pointer bg-red-300 border-red-500 hover:bg-red-400 text-white`}
          >
            Submit Review
          </button>
        </form>
      </div>
    </div>
  ) : (
    <p>Movie not found</p>
  );
};

export default MovieDetails;
