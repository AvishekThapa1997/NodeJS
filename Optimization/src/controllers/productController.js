const Product = require("../model/product");
const getProducts = async (request, response, next) => {
  // const viewPath = path.join("pug", "shop");
  response.render("shop/productList", {
    products: await Product.fetchAll(),
    pageTitle: "All Products",
    path: request.url,
  });
  // response.sendFile(path.join(dirName, "views", "html", "shop.html"));
};
const getHome = async (request, response, next) => {
  response.render("shop/home", {
    products: await Product.fetchAll(),
    pageTitle: "Shop",
    path: request.url,
  });
};
const getProductsInCart = (request, response) => {
  response.render("shop/cart", {
    pageTitle: "Your Cart",
    path: request.url,
  });
};

const getCheckout = (request, response) => {
  response.render("shop/checkout", {
    pageTitle: "Checkout",
    path: request.url,
  });
};
const getOrders = (request, response) => {
  response.render("shop/order", {
    pageTitle: "Orders",
    path: request.url,
  });
};
exports.getProducts = getProducts;
exports.getProductsInCart = getProductsInCart;
exports.getHome = getHome;
exports.getCheckout = getCheckout;
exports.getOrders = getOrders;
