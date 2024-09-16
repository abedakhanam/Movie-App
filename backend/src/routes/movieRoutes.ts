import { Router } from "express";
import { getAllMovies, getMoviebyPK } from "../controllers/movieController";
import { authToken } from "../middlewares/authUser";

const router = Router();

router.get("/", getAllMovies);
router.get("/:id", getMoviebyPK);

export default router;
