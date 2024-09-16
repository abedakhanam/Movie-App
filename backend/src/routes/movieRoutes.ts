import { Router } from "express";
import {
  addReview,
  fetchReview,
  getAllMovies,
  getMoviebyPK,
} from "../controllers/movieController";
import { authToken } from "../middlewares/authUser";

const router = Router();

router.get("/", getAllMovies);
router.get("/:id", getMoviebyPK);
router.get("/:id/reviews", fetchReview);
router.post("/:id/review", authToken, addReview);

export default router;
