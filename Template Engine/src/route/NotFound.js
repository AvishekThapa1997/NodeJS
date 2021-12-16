const express = require("express");
const path = require("path");
const dirName = require("../util/path");
//console.log(require.main.filename); // return file name with path through which app starts
//console.log(path.dirname(require.main.filename)); //returns the directory path of the file through which app starts
const route = express.Router();
route.use("/", (request, response) => {
  // response
  //   .status(404)
  //   .sendFile(path.join(dirName, "views", "html", "pageNotFound.html"));
  // const viewPath = path.join("pug", "pageNotFound");
  response.status(404).render("pageNotFound", {
    pageTitle: "Not Found",
    pageNotFoundCSS: true,
  });
});
module.exports = route;
