const express = require("express");
const router = express.Router();

const productController = require("../controllers/products");
// const path = require("path");
// const dirName = require("../util/path");

// router.get("/add-product", (request, response, next) => {
//   // response.sendFile(
//   //   path.join(`${dirName}`, "views", "html", "addProduct.html")
//   // ); // Send HTML File as Response
//   // response.send("HELLO");
//   // const viewPath = path.join("pug", "addProduct");
//   response.render("addProduct", {
//     pageTitle: "Add Product",
//     path: request.url,
//     addProductCSS: true,
//     activeAddProduct: true,
//   }); // send pug template File
// });
router.get("/add-product", productController.getAddProduct);
router.post("/add-product", productController.postAddProduct);
module.exports = router;
// module.exports = router;
