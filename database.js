import { Sequelize } from "sequelize";
import {
  DATABASE_HOST,
  DATABASE_NAME,
  DATABASE_PASSWORD,
  DATABASE_PORT,
  DATABASE_USERNAME,
} from "./utils/config.js";

export const sequelize = new Sequelize({
  dialect: "mysql",
  host: DATABASE_HOST,
  username: DATABASE_USERNAME,
  password: DATABASE_PASSWORD,
  database: DATABASE_NAME,
  port: DATABASE_PORT,
});

try {
  await sequelize.authenticate();
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}
