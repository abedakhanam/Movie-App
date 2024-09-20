import { Router } from "express";
import {
  addReview,
  fetchReview,
  getAllMovies,
  getMoviebyPK,
} from "../controllers/movieController";
import { authToken } from "../middlewares/authUser";

const router = Router();

router.get("/movies", getAllMovies);
router.get("/:id", getMoviebyPK);
router.get("/:id/reviews", fetchReview);
router.post("/:id/review", authToken, addReview); //authtoken

export default router;
