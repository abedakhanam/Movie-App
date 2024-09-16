import { Request, Response } from "express";
import { Movie, Review } from "../config/database";
import reviewSchema from "../helpers/reviewValidation";

//all movies
const getAllMovies = async (req: Request, res: Response) => {
  try {
    const allMovies = await Movie.findAll({
      attributes: ["movieID", "name", "thumbnailUrl"],
    });
    res.status(200).json({ message: "get all movie successful", allMovies });
  } catch (error) {
    return res.status(400).json({ message: "failed to fetch movies" });
  }
};

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

const addReview = async (req: Request, res: Response) => {
  const { id } = req.params;
  const movieID = parseInt(id);
  const { rating, review } = req.body;
  const userID = parseInt(req.user?.userID);
  console.log(userID);

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

    //will separate review & rating later and fix this isssue
    const newReview = await Review.create({
      movieID: movieID,
      userID: userID,
      rating,
      review,
    });

    res.status(201).json(newReview);
  } catch (error) {
    return res.status(500).json({ error: "failed to add review/rating" });
  }
};

export { getAllMovies, getMoviebyPK, fetchReview, addReview };
