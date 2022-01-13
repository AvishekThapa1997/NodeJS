import express from "express";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import bodyParser from "body-parser";
import feedRouter from "./route/feed/feedRoute.js";
import authRouter from "./route/auth/authRoute.js";
import dbSetUp from "./utils/db/db.js";
import * as path from "path";
import { imageTypes } from "./utils/util.js";
import rootDirName from "./rootDirectory.js";
import User from "./model/User.js";
import Post from "./model/Post.js";
import Status from "./model/Status.js";
const app = express();
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, `${uuidv4()}-${file.originalname}`);
  },
});
const filterContent = (req, file, cb) => {
  if (imageTypes.includes(file.mimetype)) {
    cb(null, true);
    return;
  }
  cb(null, false);
};
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,PUT,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  next();
});
app.use(
  multer({
    storage: fileStorage,
    fileFilter: filterContent,
  }).single("image")
);
app.use("/images", express.static(path.join(rootDirName, "images")));
app.use("/auth", authRouter);
app.use("/feed", feedRouter);
app.use((err, req, res, next) => {
  console.log(err);
  const statusCode = err.statusCode;
  const message = err.message;
  res.status(statusCode).json({
    message: message,
  });
});
User.hasOne(Status);
Status.belongsTo(User);
Post.belongsTo(User);
User.hasMany(Post);
dbSetUp.sync().then(() => {
  app.listen(8080);
});
