import { DataTypes, Model, Sequelize } from "sequelize";

interface UserMovieAttributes {
  userID: number;
  movieID: number;
  dateAdded?: Date;
}

class UserMovie
  extends Model<UserMovieAttributes>
  implements UserMovieAttributes
{
  public userID!: number;
  public movieID!: number;
}

const UserMovieModel = (sequelize: Sequelize) => {
  UserMovie.init(
    {
      userID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
          model: "Users",
          key: "userID",
        },
      },
      movieID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
          model: "Movies",
          key: "movieID",
        },
      },
    },
    {
      sequelize,
      modelName: "UserMovie",
      tableName: "UserMovies",
      timestamps: false,
    }
  );
  return UserMovie;
};

export default UserMovieModel;
