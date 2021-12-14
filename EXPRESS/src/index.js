const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const adminRoute = require("./route/admin");
const shopRouter = require("./route/shop");
const notFoundRouter = require("./route/NotFound");
const app = express();
app.use(express.static(path.join(__dirname, "../", "public")));
// app.use(
//   express.static(path.join(path.dirname(require.main.filename), "views"))
// );
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use("/admin", adminRoute);
app.use(shopRouter);
app.use(notFoundRouter);

const server = app.listen(3000);
