import { Sequelize, DataTypes, Model } from "sequelize";

// Define the attributes for the Movie model
interface MovieAttributes {
  movieID?: number;
  name: string;
  releaseYear: number;
  rating?: number;
  thumbnailUrl?: string;
  votes?: number;
  duration?: number;
  type?: string;
  certificate?: string;
  episodes?: number;
  nudity?: string;
  violence?: string;
  profanity?: string;
  alcohol?: string;
  frightening?: string;
  description?: string;
}

class Movie extends Model<MovieAttributes> implements MovieAttributes {
  public movieID!: number;
  public name!: string;
  public releaseYear!: number;
  public rating?: number;
  public thumbnailUrl?: string;
  public votes?: number;
  public duration?: number;
  public type?: string;
  public certificate?: string;
  public episodes?: number;
  public nudity?: string;
  public violence?: string;
  public profanity?: string;
  public alcohol?: string;
  public frightening?: string;
  public description?: string;
}

const MovieModel = (sequelize: Sequelize) => {
  Movie.init(
    {
      movieID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      releaseYear: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      rating: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      thumbnailUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      votes: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      duration: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      certificate: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      episodes: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      nudity: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      violence: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      profanity: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      alcohol: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      frightening: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Movie", // Table name will be 'Movies'
      tableName: "Movies", // Explicitly defining the table name
      timestamps: false, // Disable timestamps if you don't need them
    }
  );
  return Movie;
};

export default MovieModel;
