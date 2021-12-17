const express = require("express");
// const path = require("path");

const productController = require("../controllers/productController");
// const dirName = require("../util/path");
// const adminData = require("./admin");
//console.log(__dirname); // gives the full path of current directory
//console.log(__filename); // gives the full path of  current directory with file name
const router = express.Router();
router.get("/", productController.getHome);
router.get("/products", productController.getProducts);
router.get("/cart", productController.getProductsInCart);
router.get("/checkout", productController.getCheckout);
router.get("/orders", productController.getOrders);
module.exports = router;
