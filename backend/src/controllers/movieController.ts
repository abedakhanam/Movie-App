import { Request, Response } from "express";
import { Genre, Movie, Review } from "../config/database";
import reviewSchema from "../helpers/reviewValidation";
import { Op } from "sequelize";

// All movies with filtering
const getAllMovies = async (req: Request, res: Response) => {
  try {
    console.log(req.query);
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;
    
    const { genre, rating, type, certificate } = req.query;

    const whereClause: any = {};

    if (rating) {
      whereClause.rating = { [Op.gte]: parseInt(rating as string) };
    }
    if (type) {
      whereClause.type = type;
    }
    if (certificate) {
      whereClause.certificate = certificate;
    }

    const genreFilter = genre ? { genreName: genre } : {};

    const { rows: allMovies, count: totalMovies } = await Movie.findAndCountAll(
      {
        where: whereClause,
        include: [
          {
            model: Genre,
            where: genreFilter,
            attributes: [],
          },
        ],
        attributes: ["movieID", "name", "thumbnailUrl"],
        limit,
        offset,
        order: [["movieID", "ASC"]],
      }
    );

    const result = allMovies.map((movie) => ({
      movieID: movie.movieID,
      name: movie.name,
      thumbnailUrl: movie.thumbnailUrl,
    }));

    const totalPages = Math.ceil(totalMovies / limit);

    res.status(200).json({
      message: "Movies fetched successfully",
      currentPage: page,
      totalPages,
      totalMovies,
      limit,
      offset,
      movies: result,
    });
  } catch (error) {
    return res.status(400).json({ message: "Failed to fetch movies", error });
  }
};
// //all movies
// const getAllMovies = async (req: Request, res: Response) => {
//   try {
//     const page = parseInt(req.query.page as string) || 1; // Default to page 1
//     const limit = parseInt(req.query.limit as string) || 20; // Default to 20 movies per page
//     const offset = (page - 1) * limit; // Calculate the number of items to skip

//     const { rows: allMovies, count: totalMovies } = await Movie.findAndCountAll(
//       {
//         attributes: ["movieID", "name", "thumbnailUrl"],
//         limit,
//         offset,
//         order: [["movieID", "ASC"]],
//       }
//     );

//     // Format the movie data (if additional formatting is needed)
//     const result = allMovies.map((movie) => ({
//       movieID: movie.movieID,
//       name: movie.name,
//       thumbnailUrl: movie.thumbnailUrl,
//     }));

//     const totalPages = Math.ceil(totalMovies / limit);

//     res.status(200).json({
//       message: "Movies fetched successfully",
//       currentPage: page,
//       totalPages,
//       totalMovies,
//       limit,
//       offset,
//       movies: result,
//     });
//   } catch (error) {
//     return res.status(400).json({ message: "Failed to fetch movies", error });
//   }
// };

//one movie details + reviews
const getMoviebyPK = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const movie = await Movie.findByPk(id, {
      include: [
        {
          model: Review,
          attributes: ["reviewID", "userID", "rating", "review", "createdAt"],
        },
      ],
    });
    if (!movie) return res.status(400).json({ message: "Movie not found" });
    res.status(200).json({ message: "get movie details successful", movie });
  } catch (error) {
    return res.status(400).json({ message: "failed to fetch movie" });
  }
};

const fetchReview = async (req: Request, res: Response) => {
  const { id } = req.params;
  const movieID = parseInt(id);
  try {
    const reviews = await Review.findAll({
      where: { movieID: movieID },
      attributes: ["reviewID", "userID", "rating", "review", "createdAt"],
    });
    res.json(reviews);
  } catch (error) {
    return res.status(400).json({ message: "failed to fetch reviews" });
  }
};

//posting review
const addReview = async (req: Request, res: Response) => {
  const { id } = req.params;
  const movieID = parseInt(id);
  const { rating, review } = req.body;

  if (!req.user || !req.user.userID) {
    return res
      .status(401)
      .json({ message: "Unauthorized: User not authenticated" });
  }
  const userID = parseInt(req.user?.userID);

  try {
    const movie = await Movie.findByPk(movieID);
    if (!movie) return res.status(404).json({ message: "Movie not found" });

    const reviewValidation = reviewSchema.safeParse({
      userID,
      movieID,
      rating,
      review,
    });

    if (!reviewValidation.success) {
      //validation for review inputs
      return res.status(400).json({
        errors: reviewValidation.error.format(),
      });
    }

    // Find if the user has already given a review/rating for this movie
    const existingReview = await Review.findOne({
      where: { movieID: movieID, userID: userID },
    });

    if (existingReview) {
      // If a review/rating exists, update it with the new values
      const updatedReview = await existingReview.update({
        rating: rating || existingReview.rating, // Preserve the old rating if no new one is provided
        review: review || existingReview.review, // Preserve the old review if no new one is provided
      });

      return res.status(200).json(updatedReview);
    } else {
      // If no review/rating exists, create a new one
      const newReview = await Review.create({
        movieID: movieID,
        userID: userID,
        rating: rating || null,
        review: review || null,
      });

      return res.status(201).json(newReview);
    }
  } catch (error) {
    return res.status(500).json({ error: "failed to add review/rating" });
  }
};

const deleteReview = async (req: Request, res: Response) => {
  const { id } = req.params;
  const movieID = parseInt(id);
  const { reviewID } = req.body;
  if (!req.user || !req.user.userID) {
    return res
      .status(401)
      .json({ message: "Unauthorized: User not authenticated" });
  }
  const userID = parseInt(req.user.userID);
  try {
    // Find the review
    const review = await Review.findOne({
      where: { reviewID, movieID, userID },
    });

    // If the review does not exist or does not belong to the user, return 404
    if (!review) {
      return res
        .status(404)
        .json({ message: "Review not found or does not belong to this user" });
    }

    // Delete the review
    await review.destroy();

    return res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete review" });
  }
};

export { getAllMovies, getMoviebyPK, fetchReview, addReview, deleteReview };
