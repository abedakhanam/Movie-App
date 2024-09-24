import { Router } from "express";
import {
  addReview,
  createMovie,
  deleteMovie,
  deleteReview,
  fetchReview,
  getAllMovies,
  getAllUserMovies,
  getMoviebyPK,
  updateMovie,
} from "../controllers/movieController";
import { authToken } from "../middlewares/authUser";

const router = Router();

//get movie
router.get("/movies", getAllMovies);
router.get("/movie/:id", getMoviebyPK);

//crud user movie
router.post("/usermovie", authToken, createMovie);
router.get("/usermovie", authToken, getAllUserMovies);
router.delete("/usermovie/:id", authToken, deleteMovie);
router.put("/usermovie/:id", authToken, updateMovie);

//user review
router.get("/:id/reviews", fetchReview);
router.post("/:id/review", authToken, addReview);
router.delete("/:id/review", authToken, deleteReview);

export default router;
