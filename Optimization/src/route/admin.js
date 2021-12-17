const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");
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
router.get("/add-product", adminController.getAddProduct);
router.post("/add-product", adminController.postAddProduct);
router.get("/products", adminController.getProducts);
module.exports = router;
// module.exports = router;
