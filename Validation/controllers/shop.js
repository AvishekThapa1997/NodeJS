const Product = require("../models/product");
exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
      });
    })
    .catch((err) => {
      console.log(err);
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
      console.log(err);
    });
  //res.redirect("/");
};
exports.getIndex = (req, res, next) => {
  Product.fetchAll()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then((cart) => {
      console.log(cart);
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
      console.log(err);
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
      console.log(err);
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
    .catch((err) => console.log(err));
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
      console.log(err);
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
      return fetchedCart.setProducts(null);
    })
    .then(() => {
      res.redirect("/orders");
    });
};
