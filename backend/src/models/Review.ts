import { DataTypes, Model, Sequelize } from "sequelize";
import sequelize from "../config/database";

interface ReviewAttributes {
  reviewID?: number;
  userID: number;
  movieID: number;
  rating?: number;
  review?: string;
  createdAt?: Date;
}

class Review extends Model<ReviewAttributes> implements ReviewAttributes {
  public reviewID!: number;
  public userID!: number;
  public movieID!: number;
  public rating?: number;
  public review?: string | undefined;
  public createdAt?: Date | undefined;
}

const ReviewModel = (sequelize: Sequelize) => {
  Review.init(
    {
      reviewID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "userID",
        },
      },
      movieID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Movies",
          key: "movieID",
        },
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: true,
        // validate: {
        //   min: 1,
        //   max: 10,
        // },
      },
      review: {
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
      modelName: "Review",
      tableName: "Reviews",
      timestamps: false,
    }
  );
  return Review;
};

export default ReviewModel;
