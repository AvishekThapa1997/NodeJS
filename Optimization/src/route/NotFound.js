const express = require("express");
const pageNotFoundController = require("../controllers/pageNotFound");

// const path = require("path");
// const dirName = require("../util/path");
//console.log(require.main.filename); // return file name with path through which app starts
//console.log(path.dirname(require.main.filename)); //returns the directory path of the file through which app starts
const route = express.Router();
route.use("/", pageNotFoundController);
module.exports = route;
