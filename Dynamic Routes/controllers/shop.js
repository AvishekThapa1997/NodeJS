const Product = require("../models/product");
const Cart = require("../models/cart");
exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("shop/product-list", {
      prods: products,
      pageTitle: "All Products",
      path: "/products",
    });
  });
};
exports.getProductDetails = (req, res, next) => {
  const productId = req.params.productId;
  Product.getProductById(productId, (product) => {
    res.render("shop/product-detail", {
      product: product,
      pageTitle: product.title,
      path: "/products",
    });
  });
  //res.redirect("/");
};
exports.getIndex = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("shop/index", {
      prods: products,
      pageTitle: "Shop",
      path: "/",
    });
  });
};

exports.getCart = (req, res, next) => {
  Cart.getAllProducts((cartItems) => {
    res.render("shop/cart", {
      path: "/cart",
      pageTitle: "Your Cart",
      cartItems: cartItems.items,
      totalPrice: cartItems.totalPrice,
    });
  });
};

exports.deleteFromCart = (req, res, next) => {
  const productId = req.body.productId;
  Cart.deleteFromCart(productId, (err) => {
    if (!err) {
      res.redirect("/cart");
    }
  });
};
exports.addProductToCart = (req, res, next) => {
  const productId = req.body.productId;
  Product.getProductById(productId, (product) => {
    Cart.addToCart(product);
  });
  res.redirect("/");
};
exports.getOrders = (req, res, next) => {
  res.render("shop/orders", {
    path: "/orders",
    pageTitle: "Your Orders",
  });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};
