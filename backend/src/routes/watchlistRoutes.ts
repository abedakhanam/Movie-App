import { Router } from "express";
import { authToken } from "../middlewares/authUser";
import {
  addToWatchList,
  deleteFromWatchList,
  getWatchList,
} from "../controllers/watchlistContoller";

const router = Router();

router.post("/watchlist", authToken, addToWatchList);
router.get("/watchlist", authToken, getWatchList);
router.delete("/watchlist/:id", authToken, deleteFromWatchList);

export default router;
