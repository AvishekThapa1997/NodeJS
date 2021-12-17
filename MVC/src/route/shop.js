const express = require("express");
// const path = require("path");

const productController = require("../controllers/products");
// const dirName = require("../util/path");
// const adminData = require("./admin");
//console.log(__dirname); // gives the full path of current directory
//console.log(__filename); // gives the full path of  current directory with file name
const router = express.Router();
router.get("/", productController.getProducts);
module.exports = router;
