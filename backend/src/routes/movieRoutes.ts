import { Router } from "express";
import {
  addReview,
  deleteReview,
  fetchReview,
  getAllMovies,
  getMoviebyPK,
} from "../controllers/movieController";
import { authToken } from "../middlewares/authUser";

const router = Router();

router.get("/movies", getAllMovies);
router.get("/movie/:id", getMoviebyPK);
router.get("/:id/reviews", fetchReview);
router.post("/:id/review", authToken, addReview);
router.delete("/:id/review", authToken, deleteReview);

export default router;
