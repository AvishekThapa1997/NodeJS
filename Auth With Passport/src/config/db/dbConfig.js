import dotenv from "dotenv";
dotenv.config();
import { Sequelize } from "sequelize";

const dbConnection = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: "localhost",
    dialect: "mysql",
    logging: false,
    define: {
      freezeTableName: true,
    },
  }
);
export default dbConnection;
