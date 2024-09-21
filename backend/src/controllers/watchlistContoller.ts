import { Request, Response } from "express";
import { Movie, WatchList } from "../config/database";

export const addToWatchList = async (req: Request, res: Response) => {
  //   const { id } = req.body;
  //   const movieID = parseInt(id);
  const { movieID } = req.body;
  if (!req.user || !req.user.userID) {
    return res
      .status(401)
      .json({ message: "Unauthorized: User not authenticated" });
  }
  const userID = parseInt(req.user?.userID);
  try {
    const movie = await Movie.findByPk(movieID);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }
    // Check if the movie is already in the user's watchlist
    const existingWatchList = await WatchList.findOne({
      where: {
        userID,
        movieID,
      },
    });
    if (!existingWatchList) {
      // Add to watchlist
      await WatchList.create({ userID, movieID });
      return res.status(201).json({ message: "Movie added to watchlist" });
    } else {
      return res.status(403).json({ message: "Movie is already in watchlist" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error adding to watchlist", error });
  }
};

export const getWatchList = async (req: Request, res: Response) => {
  if (!req.user || !req.user.userID) {
    return res
      .status(401)
      .json({ message: "Unauthorized: User not authenticated" });
  }
  const userID = parseInt(req.user?.userID);
  try {
    const watchlist = await WatchList.findAll({
      where: { userID },
      include: [
        {
          model: Movie,
          attributes: [
            "movieID",
            "name",
            "thumbnailUrl",
            "rating",
            "type",
            "certificate",
          ],
        },
      ],
      order: [["dateAdded", "DESC"]],
    });

    const totalMovies = watchlist.length;

    return res.status(200).json({
      movies: watchlist,
      totalMovies,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching watchlist", error });
  }
};

// DELETE: Remove a movie from the user's watchlist
export const deleteFromWatchList = async (req: Request, res: Response) => {
  if (!req.user || !req.user.userID) {
    return res
      .status(401)
      .json({ message: "Unauthorized: User not authenticated" });
  }

  const userID = parseInt(req.user?.userID); // Extract userID from the token
  const { id } = req.params; // Movie ID from the route parameters
  const movieID = parseInt(id);

  try {
    // Check if the movie exists in the user's watchlist
    const watchlistEntry = await WatchList.findOne({
      where: { userID, movieID },
    });

    if (!watchlistEntry) {
      return res.status(404).json({
        message: "Movie not found in the watchlist",
      });
    }

    // Delete the movie from the user's watchlist
    await WatchList.destroy({
      where: { userID, movieID },
    });

    return res.status(200).json({
      message: "Movie removed from watchlist successfully",
    });
  } catch (error) {
    console.error("Error deleting movie from watchlist:", error);
    return res
      .status(500)
      .json({ message: "Error deleting movie from watchlist", error });
  }
};
