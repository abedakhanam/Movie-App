import { Sequelize, DataTypes, Model } from "sequelize";

// Define the attributes for the MovieGenre model
export interface MovieGenreAttributes {
  movieID: number;
  genreID: number;
}

class MovieGenre
  extends Model<MovieGenreAttributes>
  implements MovieGenreAttributes
{
  public movieID!: number;
  public genreID!: number;
}

const MovieGenreModel = (sequelize: Sequelize) => {
  MovieGenre.init(
    {
      movieID: {
        type: DataTypes.INTEGER,
        references: {
          model: "Movies", // Foreign key to the Movies table
          key: "movieID",
        },
        primaryKey: true,
      },
      genreID: {
        type: DataTypes.INTEGER,
        references: {
          model: "Genres", // Foreign key to the Genres table
          key: "genreID",
        },
        primaryKey: true,
      },
    },
    {
      sequelize,
      modelName: "MovieGenre", // Table name will be 'MovieGenres'
      tableName: "MovieGenres", // Explicitly defining the table name
      timestamps: false, // Disable timestamps if not needed
    }
  );
  return MovieGenre;
};

export default MovieGenreModel;
