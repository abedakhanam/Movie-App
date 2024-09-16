//db
import { Sequelize } from "sequelize";
import UserModel from "../models/User";
import MovieModel from "../models/Movie";
import GenreModel from "../models/Genre";
import MovieGenreModel from "../models/MovieGenre";
import ReviewModel from "../models/Review";
import WatchListModel from "../models/WatchList";

const sequelize = new Sequelize("moviewebapp", "mysqlclient", "admin", {
  host: "localhost",
  dialect: "postgres",
});

const User = UserModel(sequelize);
const Movie = MovieModel(sequelize);
const Genre = GenreModel(sequelize);
const MovieGenre = MovieGenreModel(sequelize);
const Review = ReviewModel(sequelize);
const WatchList = WatchListModel(sequelize);

Movie.belongsToMany(Genre, { through: MovieGenre, foreignKey: "movieID" });
Genre.belongsToMany(Movie, { through: MovieGenre, foreignKey: "genreID" });

User.hasMany(Review, { foreignKey: "userID" });
Review.belongsTo(User, { foreignKey: "userID" });

Movie.hasMany(Review, { foreignKey: "movieID" });
Review.belongsTo(Movie, { foreignKey: "movieID" });

User.belongsToMany(Movie, { through: WatchList, foreignKey: "userID" });
Movie.belongsToMany(User, { through: WatchList, foreignKey: "movieID" });

// const createTestData = async () => {
//   try {
//     // Create a genre
//     const genre = await Genre.create({
//       genreName: "Action",
//     });

//     // Create a movie
//     const movie = await Movie.create({
//       name: "Inception",
//       releaseYear: 2010,
//       rating: 8.8,
//       type: "Film",
//       certificate: "PG-13",
//     });

//     // Associate the movie with the genre
//     await (movie as any).addGenre(genre); // Ensure this is awaited

//     console.log("Movie and Genre association created!");
//   } catch (error) {
//     console.error("Error creating test data:", error);
//   }
// };

// // Call the function to create and associate data
// createTestData();

export default sequelize;
export { User, Movie, Genre, MovieGenre, Review, WatchList };
