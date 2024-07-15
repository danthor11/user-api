import { DataTypes, Model } from "sequelize";
import { sequelize } from "../database.js";

export class User extends Model {}
User.init(
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { sequelize, modelName: "User" }
);

await User.sync();
