import { DataTypes, Model, Sequelize } from "sequelize";

interface WatchListAttributes {
  userID: number;
  movieID: number;
  dateAdded?: Date;
}

class WatchList
  extends Model<WatchListAttributes>
  implements WatchListAttributes
{
  public userID!: number;
  public movieID!: number;
  public dateAdded!: Date;
}

const WatchListModel = (sequelize: Sequelize) => {
  WatchList.init(
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
      dateAdded: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "WatchList",
      tableName: "WatchLists",
      timestamps: false,
    }
  );
  return WatchList;
};

export default WatchListModel;
