"use client";
import { getMovieDetails, postReview } from "@/services/api";
import { RootState } from "@/store/store";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

interface Review {
  reviewID: number;
  userID: number;
  rating: number;
  review: string;
  createdAt: string;
}
interface Movie {
  movieID: number;
  name: string;
  releaseYear: number;
  rating: number;
  thumbnailUrl: string;
  votes: number;
  duration: number;
  type: string;
  certificate: string;
  nudity: string;
  violence: string;
  profanity: string;
  alcohol: string;
  frightening: string;
  description: string | null;
  Reviews: Review[];
}

const MovieDetails = () => {
  const params = useParams();
  const movieID = params.id;
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [review, setReview] = useState<string>("");
  const [rating, setRating] = useState<number>(0);

  const token = useSelector((state: RootState) => state.user.token);
  // console.log(token);

  useEffect(() => {
    if (movieID) {
      const fetchMovieDetails = async () => {
        try {
          const movieData = await getMovieDetails(Number(movieID));
          setMovie(movieData.movie);
        } catch (error) {
          console.error("Error fetching movie details", error);
        } finally {
          setLoading(false);
        }
      };
      fetchMovieDetails();
    }
  }, [movieID]);

  const handleSubmitReview = async (e: any) => {
    e.preventDefault();
    console.log("review: " + review);
    if (movieID && (rating || review)) {
      try {
        await postReview(
          Number(movieID),
          rating || null,
          review || null,
          token
        ); // Pass the token to the API
        // alert(`token ${token}`);
        alert(`ok`);
        setReview("");
        setRating(0);
      } catch (error) {
        console.error("Error submitting review", error);
        alert("Failed to submit the review");
      }
    } else {
      alert("Please provide both rating and review.");
    }
  };

  if (loading) return <p>Loading...</p>;
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
                {new Date(review.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))
      ) : (
        <p>No reviews available for this movie.</p>
      )}

      <div className="mb-6">
        <textarea
          className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Write your review..."
          value={review}
          onChange={(e) => setReview(e.target.value)}
        ></textarea>
        <input
          type="number"
          className="mt-2 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Rate the movie (1-10)"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          min={1}
          max={10}
        />
        <button
          className="mt-2 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
          onClick={(e) => handleSubmitReview(e)}
        >
          Submit Review
        </button>
      </div>
    </div>
  ) : (
    <p>Movie not found</p>
  );
};

export default MovieDetails;

// "use client";
// import { getMovieDetails, postReview } from "@/services/api";
// import { RootState } from "@/store/store";
// import { useParams } from "next/navigation";
// import { useEffect, useState } from "react";
// import { useSelector } from "react-redux";

// interface Review {
//   reviewID: number;
//   userID: number;
//   rating: number;
//   review: string;
//   createdAt: string;
// }
// interface Movie {
//   movieID: number;
//   name: string;
//   releaseYear: number;
//   rating: number;
//   thumbnailUrl: string;
//   votes: number;
//   duration: number;
//   type: string;
//   certificate: string;
//   nudity: string;
//   violence: string;
//   profanity: string;
//   alcohol: string;
//   frightening: string;
//   description: string | null;
//   Reviews: Review[];
// }

// const MovieDetails = () => {
//   const params = useParams();
//   const movieID = params.id;
//   const [movie, setMovie] = useState<Movie | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [review, setReview] = useState<string>("");
//   const [rating, setRating] = useState<number | null>(null);

//   const token = useSelector((state: RootState) => state.user.token);

//   useEffect(() => {
//     if (movieID) {
//       const fetchMovieDetails = async () => {
//         try {
//           const movieData = await getMovieDetails(Number(movieID));
//           setMovie(movieData.movie);
//         } catch (error) {
//           console.error("Error fetching movie details", error);
//         } finally {
//           setLoading(false);
//         }
//       };
//       fetchMovieDetails();
//     }
//   }, [movieID]);

//   const handleSubmitReview = (e: any) => {
//     // Ensure at least one of `rating` or `review` is provided
//     e.preventDefault();
//     if (!rating && !review.trim()) {
//       alert("Please provide at least a rating or a review.");
//       return;
//     }
//     console.log("Submitting review:", { movieID, rating, review, token });
//     try {
//       if (rating !== null && review == "") {
//         postReview(Number(movieID), rating, null, token);
//         alert("Rating submitted successfully!");
//         setRating(null);
//       } else if (review.trim() !== "" && rating == null) {
//         postReview(Number(movieID), null, review.trim(), token);
//         alert("Review submitted successfully!");
//         setReview("");
//       } else if (review.trim() !== "" && rating !== null) {
//         postReview(Number(movieID), rating, review.trim(), token);
//         alert("Posted successfully!");
//         setReview("");
//         setRating(null);
//       } else {
//         alert("Please provide at least a rating or a review.");
//         return;
//       }

//       // Refresh the movie details to show the new review/rating
//       const movieData = getMovieDetails(Number(movieID));
//       setMovie(movieData.movie);
//       postReview(
//         Number(movieID),
//         rating ? rating : null, // Allow null values
//         review ? review.trim() : null,
//         token
//       );
//       alert("Review submitted successfully!");
//       setReview("");
//       setRating(null);
//     } catch (error) {
//       console.error("Error submitting review", error);
//       alert("Failed to submit the review");
//     }
//   };

//   if (loading) return <p>Loading...</p>;
//   return movie ? (
//     <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
//       <div className="flex items-center space-x-4 mb-4">
//         <img
//           src={movie.thumbnailUrl}
//           alt={movie.name}
//           className="w-48 h-auto rounded-lg"
//         />
//         <div>
//           <h1 className="text-4xl font-bold mb-2">
//             {movie.name}{" "}
//             <span className="text-xl font-normal">({movie.releaseYear})</span>
//           </h1>
//         </div>
//       </div>

//       <div className="flex flex-wrap gap-4 mb-6">
//         <div className="bg-gray-200 px-4 py-2 rounded-lg">
//           <strong>Rating:</strong> {movie.rating}
//         </div>
//         <div className="bg-gray-200 px-4 py-2 rounded-lg">
//           <strong>Votes:</strong> {movie.votes}
//         </div>
//         <div className="bg-gray-200 px-4 py-2 rounded-lg">
//           <strong>Duration:</strong> {movie.duration} minutes
//         </div>
//         <div className="bg-gray-200 px-4 py-2 rounded-lg">
//           <strong>Type:</strong> {movie.type}
//         </div>
//         <div className="bg-gray-200 px-4 py-2 rounded-lg">
//           <strong>Certificate:</strong> {movie.certificate}
//         </div>
//       </div>

//       <div className="flex flex-wrap gap-4 mb-6">
//         <div className="bg-gray-200 px-4 py-2 rounded-lg">
//           <strong>Nudity:</strong> {movie.nudity}
//         </div>
//         <div className="bg-gray-200 px-4 py-2 rounded-lg">
//           <strong>Violence:</strong> {movie.violence}
//         </div>
//         <div className="bg-gray-200 px-4 py-2 rounded-lg">
//           <strong>Profanity:</strong> {movie.profanity}
//         </div>
//         <div className="bg-gray-200 px-4 py-2 rounded-lg">
//           <strong>Alcohol:</strong> {movie.alcohol}
//         </div>
//         <div className="bg-gray-200 px-4 py-2 rounded-lg">
//           <strong>Frightening:</strong> {movie.frightening}
//         </div>
//       </div>

//       <h2 className="text-2xl font-bold mb-4">Reviews</h2>

//       {movie.Reviews.length > 0 ? (
//         movie.Reviews.map((review) => (
//           <div
//             key={review.reviewID}
//             className="bg-gray-100 p-4 rounded-lg mb-4"
//           >
//             <p className="font-bold">User {review.userID}:</p>
//             <p>{review.review}</p>
//             <div className="flex justify-between mt-2">
//               <p className="text-sm">
//                 <strong>Rating:</strong> {review.rating}/10
//               </p>
//               <p className="text-sm">
//                 <strong>Date:</strong>{" "}
//                 {new Date(review.createdAt).toLocaleDateString()}
//               </p>
//             </div>
//           </div>
//         ))
//       ) : (
//         <p>No reviews available for this movie.</p>
//       )}

//       <div className="mb-6">
//         <textarea
//           className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           placeholder="Write your review..."
//           value={review || ""}
//           onChange={(e) => setReview(e.target.value)}
//         ></textarea>
//         <button
//           className="mt-2 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
//           onClick={(e) => handleSubmitReview(e)}
//         >
//           Submit Review
//         </button>
//         <input
//           type="number"
//           className="mt-2 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           placeholder="Rate the movie (1-10)"
//           value={rating || ""}
//           onChange={(e) => setRating(Number(e.target.value))}
//           min={1}
//           max={10}
//         />
//         <button
//           className="mt-2 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
//           onClick={(e) => handleSubmitReview(e)}
//         >
//           Submit Rating
//         </button>
//       </div>
//     </div>
//   ) : (
//     <p>Movie not found</p>
//   );
// };

// export default MovieDetails;
