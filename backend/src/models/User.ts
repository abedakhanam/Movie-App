import { Sequelize, DataTypes, Model } from "sequelize";

// Define the attributes for the User model
interface UserAttributes {
  userID?: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  createdAt?: Date;
}

class User extends Model<UserAttributes> implements UserAttributes {
  public userID!: number;
  public firstName!: string;
  public lastName!: string;
  public username!: string;
  public email!: string;
  public password!: string;
  public createdAt!: Date;
}

const UserModel = (sequelize: Sequelize) => {
  User.init(
    {
      userID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        // validate: {
        //   isEmail: true,
        // },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "User", // Table name will be 'Users'
      tableName: "Users", // Explicitly defining the table name
      timestamps: false, // Disable timestamps if you don't need them
    }
  );
  return User;
};

export default UserModel;
