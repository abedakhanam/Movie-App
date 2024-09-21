import { Sequelize, DataTypes, Model } from "sequelize";

// Define the attributes for the Genre model
export interface GenreAttributes {
  genreID?: number;
  genreName: string;
}

class Genre extends Model<GenreAttributes> implements GenreAttributes {
  public genreID!: number;
  public genreName!: string;
}

const GenreModel = (sequelize: Sequelize) => {
  Genre.init(
    {
      genreID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      genreName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Genre", // Table name will be 'Genres'
      tableName: "Genres", // Explicitly defining the table name
      timestamps: false, // Disable timestamps if not needed
    }
  );
  return Genre;
};

export default GenreModel;
