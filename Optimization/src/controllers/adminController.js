const Product = require("../model/product");
const getAddProduct = (request, response) => {
  response.render("admin/addProduct", {
    pageTitle: "Add Product",
    path: request.url,
  });
};
const postAddProduct = (request, response, next) => {
  const { title, imageUrl, description, price } = request.body;
  const product = new Product(title, imageUrl, description, price);
  product.save();
  response.redirect("/");
};
const getProducts = async (request, response, next) => {
  response.render("admin/productList", {
    products: await Product.fetchAll(),
    pageTitle: "Admin Products",
    path: "/admin/products",
  });
};
exports.getAddProduct = getAddProduct;
exports.postAddProduct = postAddProduct;
exports.getProducts = getProducts;
