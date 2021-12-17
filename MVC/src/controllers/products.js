const Product = require("../model/product");
const getAddProduct = (request, response) => {
  response.render("addProduct", {
    pageTitle: "Add Product",
    path: request.url,
  });
};
const postAddProduct = (request, response, next) => {
  const product = new Product(request.body.title);
  product.save();
  response.redirect("/");
};
const getProducts = async (request, response, next) => {
  // const viewPath = path.join("pug", "shop");
  response.render("shop", {
    products: await Product.fetchAll(),
    pageTitle: "Shop",
    path: "/",
  });
  // response.sendFile(path.join(dirName, "views", "html", "shop.html"));
};
exports.getAddProduct = getAddProduct;
exports.postAddProduct = postAddProduct;
exports.getProducts = getProducts;
