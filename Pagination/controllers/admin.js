const { validationResult } = require("express-validator");
const {
  separateValidationError,
  deleteFile,
  itemPerPage,
} = require("../util/util");
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
  const { title, price, description, productId: id } = req.body;
  const image = req.file;
  Product.getProductByIdAndUserId(id, req.user.id)
    .then((product) => {
      if (!product) {
        res.redirect("/");
        return null;
      }
      const updatedProduct = { id, title, price, description };
      if (image) {
        updatedProduct.imageUrl = image.path;
      }
      return Product.save(updatedProduct);
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
  const { title, price, description } = req.body;
  const image = req.file;
  const imageUrl = image.path;
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
  const productId = req.params.productId;
  Product.getProductById(productId)
    .then((product) => {
      console.log(product);
      if (!product) {
        next(new Error("Product Not Found"));
      }
      deleteFile(product.imageUrl);
      return Product.deleteById(productId, req.user.id);
    })
    .then(() => {
      res.status(200).json({
        message: "Success",
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: "Something went Wrong!",
      });
    });
};
exports.getProducts = (req, res, next) => {
  const page = req.query.page ?? 1;
  let _totalProducts = 0;
  Product.getTotatNoOfProducts()
    .then((totalProducts) => {
      _totalProducts = totalProducts;
      return req.user.getProducts({
        limit: itemPerPage,
        offset: (+page - 1) * itemPerPage,
      });
    })
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
        currentPage: +page,
        prevPage: page > 1 ? page - 1 : null,
        nextPage: _totalProducts > +page * itemPerPage ? +page + 1 : null,
        lastPage: Math.ceil(_totalProducts / itemPerPage),
      });
    })
    .catch((err) => {
      next(err);
    });
};
