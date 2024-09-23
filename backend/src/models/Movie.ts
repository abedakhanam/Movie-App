import { Sequelize, DataTypes, Model } from "sequelize";

// Define the attributes for the Movie model
interface MovieAttributes {
  movieID?: number;
  name: string;
  releaseYear: number | null;
  rating?: number | null;
  thumbnailUrl?: string | null;
  votes?: number | null;
  duration?: number | null;
  type?: string | null;
  certificate?: string | null;
  episodes?: number | null;
  nudity?: string | null;
  violence?: string | null;
  profanity?: string | null;
  alcohol?: string | null;
  frightening?: string | null;
  description?: string | null;
  createdAt?: Date;
}

class Movie extends Model<MovieAttributes> implements MovieAttributes {
  public movieID!: number;
  public name!: string;
  public releaseYear!: number | null;
  public rating?: number | null;
  public thumbnailUrl?: string | null;
  public votes?: number | null;
  public duration?: number | null;
  public type?: string | null;
  public certificate?: string | null;
  public episodes?: number | null;
  public nudity?: string | null;
  public violence?: string | null;
  public profanity?: string | null;
  public alcohol?: string | null;
  public frightening?: string | null;
  public description?: string | null;
  public createdAt?: Date | undefined;
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
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
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
