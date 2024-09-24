import { Request, Response } from "express";
import {
  Genre,
  Movie,
  MovieGenre,
  Review,
  UserMovie,
} from "../config/database";
import reviewSchema from "../helpers/reviewValidation";
import { Op } from "sequelize";

import path from "path";
import sharp from "sharp";
import multer from "multer";
import { upload } from "../helpers/multer";
import { createMovieSchema } from "../helpers/movieValidation";

// All movies with filtering
const getAllMovies = async (req: Request, res: Response) => {
  //router.get("/api/movies", getAllMovies);
  try {
    // console.log("hitting from frontend: " + JSON.stringify(req.query));
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;

    const { genre, rating, type, certificate, search } = req.query;

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
    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const genreFilter = genre ? { genreName: genre } : {};

    const { rows: allMovies, count: totalMovies } = await Movie.findAndCountAll(
      {
        where: whereClause,
        include: [
          {
            model: Genre,
            where: genreFilter,
            attributes: ["genreName"],
            through: { attributes: [] },
          },
        ],
        attributes: [
          "movieID",
          "name",
          "thumbnailUrl",
          "rating",
          "type",
          "certificate",
          "createdAt",
        ],
        limit,
        offset,
        order: [["movieID", "ASC"]],
      }
    );

    const totalPages = Math.ceil(totalMovies / limit);

    res.status(200).json({
      message: "Movies fetched successfully",
      currentPage: page,
      totalPages,
      totalMovies,
      limit,
      offset,
      movies: allMovies,
    });
  } catch (error) {
    return res.status(400).json({ message: "Failed to fetch movies", error });
  }
};

// Create a movie
export const createMovie = async (req: Request, res: Response) => {
  if (!req.user || !req.user.userID) {
    return res
      .status(401)
      .json({ message: "Unauthorized: User not authenticated" });
  }
  const userID = parseInt(req.user?.userID);

  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: err.message });
    } else if (err) {
      return res.status(400).json({ error: "Unknown error occurred" });
    }
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    try {
      // Check if there's a file and retrieve its path
      let imagePath;
      if (req.file) {
        const compressedFileName = `compressed-${req.file.filename}`;
        const compressedImagePath = path.join("uploads", compressedFileName);

        // Compress and save the image locally
        await sharp(req.file.path)
          .resize(600) // Resize the image to 600px width
          .jpeg({ quality: 60 }) // Compress the image
          .toFile(compressedImagePath); // Save the compressed image locally

        imagePath = `/${compressedFileName}`; // Store the path to the compressed image without 'uploads'
      }
      const newMovie = await Movie.create({
        name: req.body.name,
        releaseYear: parseInt(req.body.releaseYear), //validTE LATER
        rating: parseInt(req.body.rating),
        votes: parseInt(req.body.votes),
        duration: parseInt(req.body.duration),
        type: req.body.type,
        certificate: req.body.certificate,
        description: req.body.description,
        thumbnailUrl: imagePath,
      });

      // Find or create genres and associate them
      if (req.body.genres) {
        const genres = await Genre.findAll({
          where: { genreID: req.body.genres },
        });

        if (genres.length !== req.body.genres.length) {
          return res
            .status(400)
            .json({ error: "One or more genres are invalid" });
        }

        // Populate MovieGenre join table
        await MovieGenre.bulkCreate(
          genres.map((genre) => ({
            movieID: newMovie.movieID,
            genreID: genre.genreID,
          }))
        );
      }
      //populate usermovie table
      await UserMovie.create({
        movieID: newMovie.movieID,
        userID: userID,
      });

      return res.status(201).json(newMovie);
    } catch (error) {
      return res.status(400).json({ message: error });
    }
  });
};

export const getAllUserMovies = async (req: Request, res: Response) => {
  // Check if the user is authenticated
  if (!req.user || !req.user.userID) {
    return res
      .status(401)
      .json({ message: "Unauthorized: User not authenticated" });
  }

  const userID = parseInt(req.user.userID);

  // console.log(userID);

  try {
    // Find all movies created by the user using the UserMovie table
    const userMovies = await UserMovie.findAll({
      where: { userID },
      attributes: ["movieID"],
    });
    // console.log(`userMovies    ${JSON.stringify(userMovies)}`);
    if (!userMovies)
      return res
        .status(400)
        .json({ message: "User has not created any movies" });

    // Extract movieIDs from the result
    const movieIDs = userMovies.map((um) => um.movieID);

    // Now, fetch movie details for these movieIDs
    const movieDetails = await Movie.findAll({
      where: {
        movieID: {
          [Op.in]: movieIDs,
        },
      },
      attributes: [
        "movieID",
        "name",
        "releaseYear",
        "rating",
        "votes",
        "duration",
        "type",
        "certificate",
        "description",
        "thumbnailUrl",
        "createdAt",
      ],
      order: [["createdAt", "DESC"]], // Sort by createdAt in descending order
    });

    return res.status(200).json(movieDetails);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to retrieve user movies",
    });
  }
};

const deleteMovie = async (req: Request, res: Response) => {
  if (!req.user || !req.user.userID) {
    return res
      .status(401)
      .json({ message: "Unauthorized: User not authenticated" });
  }
  const userID = parseInt(req.user.userID);
  const { id } = req.params;
  const movieID = parseInt(id);
  if (isNaN(movieID)) {
    return res.status(400).json({ message: "Invalid movie ID" });
  }
  try {
    const userMovie = await UserMovie.findOne({
      where: { userID, movieID },
    });
    if (!userMovie) {
      return res
        .status(404)
        .json({ message: "Review not found or does not belong to this user" });
    }
    // Delete
    await userMovie.destroy();
    // Check if the movie exists in the Movie table
    const movie = await Movie.findOne({
      where: { movieID },
    });
    if (movie) {
      await movie.destroy();
    }
    return res.status(200).json({ message: "Movie successfully deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete movie" });
  }
};

// Update a movie
// export const updateMovie = async (req: Request, res: Response) => {
//   try {
//     const movieID = req.params.id;

//     // Validate request body
//     const validatedData = updateMovieSchema.parse(req.body);

//     // Find the movie by ID
//     const movie = await Movie.findByPk(movieID);
//     if (!movie) {
//       return res.status(404).json({ error: "Movie not found" });
//     }

//     // Update the movie details
//     await movie.update(validatedData);

//     // If genres are passed, update the MovieGenre association
//     if (validatedData.genres) {
//       const genres = await Genre.findAll({
//         where: { genreID: validatedData.genres },
//       });

//       if (genres.length !== validatedData.genres.length) {
//         return res
//           .status(400)
//           .json({ error: "One or more genres are invalid" });
//       }

//       // First, clear existing genres for this movie
//       await MovieGenre.destroy({ where: { movieID: movie.movieID } });

//       // Add new associations in the MovieGenre table
//       await MovieGenre.bulkCreate(
//         genres.map((genre) => ({
//           movieID: movie.movieID,
//           genreID: genre.genreID,
//         }))
//       );
//     }

//     return res.status(200).json(movie);
//   } catch (error) {
//     return res.status(400).json({ message: "failed to update movie" });
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

export {
  getAllMovies,
  getMoviebyPK,
  fetchReview,
  addReview,
  deleteReview,
  deleteMovie,
};
