const { validationResult } = require("express-validator");
const { separateValidationError } = require("../util/util");
const { showError } = require("../util/showError");
const Product = require("../models/product");
exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editMode: false,
    product: null,
    validatonErrors: null,
    errorMessage: null,
  });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    res.redirect("/");
  }
  const productId = req.params.productId;
  req.user
    .getProducts(productId, {
      where: {
        id: productId,
      },
    })
    .then(([data]) => {
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editMode: true,
        product: data,
        validatonErrors: null,
        prevInput: null,
        errorMessage: null,
      });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postEditProduct = (req, res, next) => {
  const { title, imageUrl, price, description, productId: id } = req.body;
  Product.getProductByIdAndUserId(id, req.user.id)
    .then((product) => {
      if (!product) {
        res.redirect("/");
        return null;
      }
      return Product.save({ id, title, price, description, imageUrl });
    })
    .then((updateProduct) => {
      if (updateProduct) {
        return res.redirect("/admin/products");
      }
      res.redirect("/");
    })
    .catch((err) => {
      next(err);
    });
};
exports.postAddProduct = (req, res, next) => {
  const { title, imageUrl, price, description } = req.body;
  req.user
    .createProduct({
      title,
      price,
      description,
      imageUrl,
    })
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      next(err);
    });
};
exports.deleteProduct = (req, res, next) => {
  const { productId } = req.body;
  Product.deleteById(productId, req.user.id)
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch((err) => {
      showError(next, err);
    });
};
exports.getProducts = (req, res, next) => {
  req.user
    .getProducts()
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
      });
    })
    .catch((err) => {
      next(err);
    });
};
