const express = require("express");
const router = express.Router();
const path = require("path");
const dirName = require("../util/path");
const products = [];
router.get("/add-product", (request, response, next) => {
  // response.sendFile(
  //   path.join(`${dirName}`, "views", "html", "addProduct.html")
  // ); // Send HTML File as Response
  // response.send("HELLO");
  // const viewPath = path.join("pug", "addProduct");
  console.log(request.url);
  response.render("addProduct", {
    pageTitle: "Add Product",
    path: request.url,
    addProductCSS: true,
    activeAddProduct: true,
  }); // send pug template File
});
router.post("/add-product", (request, response, next) => {
  products.push({
    title: request.body.title,
  });
  response.redirect("/");
});
exports.products = products;
exports.router = router;
// module.exports = router;
