import session from "express-session";
import sequelizeSession from "connect-session-sequelize";
import dbConnection from "../db/dbConfig.js";
const SequelizeStore = sequelizeSession(session.Store);
import dotenv from "dotenv";
dotenv.config();
const createSession = () => {
  return session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
      db: dbConnection,
    }),
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
    },
  });
};
export default createSession;
