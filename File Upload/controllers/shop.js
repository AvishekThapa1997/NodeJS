const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");
const Product = require("../models/product");
const Order = require("../models/order");
const { showError } = require("../util/showError");
const { itemPerPage } = require("../util/util");
exports.getProducts = (req, res, next) => {
  const page = req.query.page ?? 1;
  let _totalProducts = 0;
  Product.getTotatNoOfProducts()
    .then((totalProducts) => {
      _totalProducts = totalProducts;
      return Product.fetchAll((+page - 1) * itemPerPage);
    })
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
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
exports.getProductDetails = (req, res, next) => {
  const productId = req.params.productId;
  Product.getProductById(productId)
    .then((product) => {
      res.render("shop/product-detail", {
        product: product,
        pageTitle: product.title,
        path: "/products",
      });
    })
    .catch((err) => {
      next(err);
    });
  //res.redirect("/");
};
exports.getIndex = (req, res, next) => {
  const page = req.query.page ?? 1;
  let _totalProducts = 0;
  Product.getTotatNoOfProducts()
    .then((totalProducts) => {
      _totalProducts = totalProducts;
      return Product.fetchAll((+page - 1) * itemPerPage);
    })
    .then((products) => {
      console.log("================================================");
      console.log(Math.ceil(_totalProducts / itemPerPage));
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
        currentPage: +page,
        prevPage: page > 1 ? page - 1 : null,
        nextPage: _totalProducts > +page * itemPerPage ? +page + 1 : null,
        lastPage: Math.ceil(_totalProducts / itemPerPage),
      });
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then((cart) => {
      if (!cart) {
        return req.user.createCart();
      }
      return cart;
    })
    .then((cart) => {
      return cart.getProducts();
    })
    .then((products) => {
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        cartProducts: products,
        totalPrice: 0,
      });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteFromCart = (req, res, next) => {
  const productId = req.body.productId;
  req.user
    .getCart()
    .then((cart) => {
      return cart.getProducts({
        where: {
          id: productId,
        },
      });
    })
    .then(([product]) => {
      return product.cartItem.destroy();
    })
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => {
      next(err);
    });
};
exports.addProductToCart = (req, res, next) => {
  const productId = req.body.productId;
  let userCart;
  let _quantity = 1;
  req.user
    .getCart()
    .then((cart) => {
      userCart = cart;
      return cart.getProducts({
        where: {
          id: productId,
        },
      });
    })
    .then((products) => {
      if (products.length > 0) {
        const [product] = products;
        _quantity = product.cartItem.quantity + 1;
        return product;
      }
      return Product.getProductById(productId);
    })
    .then((product) => {
      return userCart.addProduct(product, {
        through: {
          quantity: _quantity,
        },
      });
    })
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => showError(next, err));
};
exports.getOrders = (req, res, next) => {
  req.user
    .getOrders({
      include: ["products"],
    })
    .then((orders) => {
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
        orders: orders,
      });
    })
    .catch((err) => {
      next(err);
    });
};

exports.checkoutProducts = (req, res, next) => {
  let fetchedCart;
  const user = req.user;
  Promise.allSettled([user.createOrder(), user.getCart()])
    .then(([{ value: order }, { value: cart }]) => {
      fetchedCart = cart;
      cart.getProducts().then((products) => {
        return order.addProducts(
          products.map((product) => {
            product.orderItem = {
              quantity: product.cartItem.quantity,
            };
            return product;
          })
        );
      });
    })
    .then((data) => {
      //console.log(data);
      return fetchedCart.setProducts(null);
    })
    .then(() => {
      res.redirect("/orders");
    })
    .catch((err) => next(err));
};
exports.getInvoice = (req, res, next) => {
  const orderId = req.params.orderId;
  let _order;
  Order.findById(orderId)
    .then((order) => {
      if (!order) {
        throw new Error("No Order Found");
      }
      _order = order;
      return order.getUser();
    })
    .then((user) => user.id === req.user.id)
    .then((authorized) => {
      if (!authorized) {
        throw new Error("Not Authorized");
      }
      const invoiceName = `invoice-${orderId}.pdf`;
      const invoicePath = path.join("data", "invoices", invoiceName);
      // fs.readFile(invoicePath, (err, data) => {
      //   if (err) {
      //     return next(err);
      //   }
      //   res.setHeader("Content-Type", "application/pdf");
      //   res.setHeader(
      //     "Content-Disposition",
      //     'inline; filename="' + invoiceName + '"'
      //   );
      //   res.send(data);
      // });
      const pdfDoc = new PDFDocument();
      let totalPrice = 0;
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        'inline;filename="' + invoiceName + '"'
      );
      pdfDoc.pipe(fs.createWriteStream(invoicePath));
      pdfDoc.pipe(res);
      // pdfDoc.info({
      //   title: invoiceName,
      // });
      pdfDoc
        .fontSize(24)
        .text("Invoice", {
          underline: true,
        })
        .moveDown();
      _order
        .getProducts()
        .then((products) => {
          products.forEach((product) => {
            totalPrice += product.orderItem.quantity * product.price;
            pdfDoc
              .fontSize(16)
              .text(
                `${product.title} - ${product.orderItem.quantity} * $${product.price}`
              );
          });
          pdfDoc.moveDown();
          pdfDoc.fontSize(20).text(`Total Price - $${totalPrice}`);
          pdfDoc.end();
        })
        .catch((err) => next(err));
    })
    .catch((err) => {
      next(err);
    });
};
