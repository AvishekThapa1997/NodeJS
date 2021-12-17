const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const expressHandleBars = require("express-handlebars"); // only for express handlebars template Engine

const adminRouter = require("./route/admin");
const shopRouter = require("./route/shop");
const notFoundRouter = require("./route/NotFound");
const dirName = require("./util/path");

const app = express();

//const viewPathLocation = path.join(`${dirName}`, "views", "pug");
//app.set("view engine", "pug"); // telling express which template being used in this case pug
//app.set("views", viewPathLocation); // telling where to look for template or views if we have views in folder templates we would write app.set("view","templates")

// For Handlebars
// const viewPathLocation = path.join(`${dirName}`, "views", "handlebars");
// app.engine(
//   "hbs",
//   expressHandleBars({
//     layoutsDir: path.join(viewPathLocation, "layouts"),
//     defaultLayout: "main-layout",
//     extname: "hbs",
//   })
// ); // telling express that handle bar template engine is uses no need to be hbs can be anything but whatever mention here that should be the file extension too like 404.hbs
// app.set("view engine", "hbs");

//For EJS
const viewPathLocation = path.join(`${dirName}`, "views", "ejs");
app.set("view engine", "ejs"); // telling express which template being used in this case ejs
app.set("views", viewPathLocation); // telling where to look for template or views if we have views in folder templates we would write app.set("view","templates")
app.use(express.static(path.join(__dirname, "../", "public")));
// app.use(
//   express.static(path.join(path.dirname(require.main.filename), "views"))
// );s
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use("/admin", adminRouter);
app.use(shopRouter);
app.use(notFoundRouter);

const server = app.listen(3000);
