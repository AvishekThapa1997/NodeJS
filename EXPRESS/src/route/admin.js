const express = require("express");
const router = express.Router();
const path = require("path");
const dirName = require("../util/path");
router.get("/add-product", (request, response, next) => {
  response.sendFile(path.join(dirName, "views", "addProduct.html"));
  // response.send("HELLO");
});
router.post("/product", (request, response, next) => {
  //console.log(request.body);
  response.redirect("/");
});
module.exports = router;
