const express = require("express");
const path = require("path");
const dirName = require("../util/path");
//console.log(require.main.filename); // return file name with path through which app starts
//console.log(path.dirname(require.main.filename)); //returns the directory path of the file through which app starts
const route = express.Router();
route.use("/", (request, response) => {
  response
    .status(404)
    .sendFile(path.join(dirName, "views", "pageNotFound.html"));
});
module.exports = route;
