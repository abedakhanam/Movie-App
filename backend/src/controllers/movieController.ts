import { Request, Response } from "express";
import { Movie } from "../config/database";

const getAllMovies = async (req: Request, res: Response) => {
  try {
    const allMovies = await Movie.findAll();
    res.status(200).json({ message: "get all movie successful", allMovies });
  } catch (error) {
    return res.status(400).json({ message: "couldnt fetch movie" });
  }
};

const getMoviebyPK = async (req: Request, res: Response) => {
  try {
    const { movieID } = req.body;
    const movie = await Movie.findByPk(movieID);
    if (!movie)
      return res.status(400).json({ message: "couldnt find movie id" });
    res.status(200).json({ message: "get movie details successful", movie });
  } catch (error) {
    return res.status(400).json({ message: "couldnt fetch movie" });
  }
};

export { getAllMovies, getMoviebyPK };
