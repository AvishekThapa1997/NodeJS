const fs = require("fs");
const path = require("path");
const sourcePath = path.join(
  path.dirname(require.main.filename),
  "data",
  "cart.json"
);
module.exports = class Cart {
  constructor(products) {
    (this.products = products), (this.totalPrice = 0);
  }
  static getAllProducts(cb) {
    fs.readFile(sourcePath, (err, fileContent) => {
      if (!err) {
        cb(JSON.parse(fileContent));
        return;
      }
      cb(null);
    });
  }
  static addToCart(product) {
    fs.readFile(sourcePath, (err, fileContent) => {
      let cartContent = { items: [], totalPrice: 0 };
      if (!err) {
        cartContent = JSON.parse(fileContent);
      }
      const existingProductIndex = cartContent.items.findIndex(
        (item) => item.product.id === product.id
      );
      let updatedProject;
      if (existingProductIndex >= 0) {
        let existingProduct = cartContent.items.at(existingProductIndex);
        updatedProject = {
          ...existingProduct,
          quantity: +existingProduct.quantity + 1,
        };
        cartContent.items = [...cartContent.items];
        cartContent.items[existingProductIndex] = updatedProject;
      } else {
        updatedProject = {
          product: product,
          quantity: 1,
        };
        cartContent.items = [...cartContent.items, updatedProject];
      }
      cartContent.totalPrice = +cartContent.totalPrice + +product.price;
      fs.writeFile(sourcePath, JSON.stringify(cartContent), (err) => {
        // console.log(err);
      });
    });
  }
  static deleteFromCart(productId, cb) {
    fs.readFile(sourcePath, (err, fileContent) => {
      if (err) {
        return;
      }
      const cartItems = JSON.parse(fileContent);
      const prevProduct = cartItems.items.find(
        (item) => item.product.id === productId
      );
      if (prevProduct) {
        const filteredCartItems = cartItems.items.filter(
          (item) => item.product.id !== productId
        );
        const updatedCartItems = {
          items: filteredCartItems,
          totalPrice:
            cartItems.totalPrice -
            +prevProduct.product.price * +prevProduct.quantity,
        };
        fs.writeFile(sourcePath, JSON.stringify(updatedCartItems), (err) => {
          // console.log(err);
          cb(err);
        });
      } else {
        cb(null);
      }
    });
  }
};
