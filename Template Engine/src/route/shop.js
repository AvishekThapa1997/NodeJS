const express = require("express");
const path = require("path");
const dirName = require("../util/path");
const adminData = require("./admin");
//console.log(__dirname); // gives the full path of current directory
//console.log(__filename); // gives the full path of  current directory with file name
const router = express.Router();
router.get("/", (request, response, next) => {
  // const viewPath = path.join("pug", "shop");
  response.render("shop", {
    products: adminData.products,
    pageTitle: "Shop",
    path: "/",
    hasProducts: adminData.products && adminData.products.length > 0,
    productCSS: true,
    activeShop: true,
  });
  // response.sendFile(path.join(dirName, "views", "html", "shop.html"));
});
module.exports = router;
