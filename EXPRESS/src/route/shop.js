const express = require("express");
const path = require("path");
const dirName = require("../util/path");
//console.log(__dirname); // gives the full path of current directory
//console.log(__filename); // gives the full path of  current directory with file name
const router = express.Router();
router.get("/", (request, response, next) => {
  response.sendFile(path.join(dirName, "views", "shop.html"));
});
module.exports = router;
