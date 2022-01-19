import express from "express";
import dotenv from "dotenv";
import dbConnection from "./config/db/dbConfig.js";
import createSession from "./config/session/sessionConfig.js";
import passport from "passport";
import router from "./routes/router.js";
import authConfig from "./config/auth/authConfig.js";
dotenv.config();
const app = express();
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(createSession());
app.use(passport.initialize());
app.use(passport.session());
// app.use((req, res, next) => {
//   console.log(req.session);
//   console.log(req.user);
//   next();
// });
app.use(router);
dbConnection.sync().then(() => {
  app.listen(process.env.PORT);
});
