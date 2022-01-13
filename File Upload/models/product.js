// const fs = require("fs");
// const path = require("path");
// const db = require("../util/db");
// const p = path.join(
//   path.dirname(process.mainModule.filename),
//   "data",
//   "products.json"
// );

// const getProductsFromFile = (cb) => {
//   fs.readFile(p, (err, fileContent) => {
//     if (err) {
//       cb([]);
//     } else {
//       cb(JSON.parse(fileContent));
//     }
//   });
// };

// module.exports = class Product {
//   constructor(id, title, imageUrl, description, price) {
//     this.id = id;
//     this.title = title;
//     this.imageUrl = imageUrl;
//     this.description = description;
//     this.price = price;
//   }

//   save() {
//     return db.execute(
//       "INSERT INTO product(title,price,description,imageUrl) value (?,?,?,?)",
//       [this.title, this.price, this.description, this.imageUrl]
//     );
//     // getProductsFromFile((products) => {
//     //   if (this.id) {
//     //     const findProductIndex = products.findIndex(
//     //       (product) => product.id === this.id
//     //     );
//     //     const updatedProducts = [...products];
//     //     updatedProducts[findProductIndex] = this;
//     //     fs.writeFile(p, JSON.stringify(updatedProducts), (err) => {
//     //       console.log(err);
//     //     });
//     //     return;
//     //   }
//     //   this.id = Math.random().toString();
//     //   products.push(this);
//     //   fs.writeFile(p, JSON.stringify(products), (err) => {
//     //     console.log(err);
//     //   });
//     // });
//   }

//   static fetchAll() {
//     //getProductsFromFile(cb);
//     return db.execute("SELECT * FROM product");
//   }
//   static getProductById(productId) {
//     return db.execute("SELECT * FROM product WHERE id = ?", [productId]);
//     // getProductsFromFile((products) => {
//     //   const currentProduct = products.find((p) => p.id === productId);
//     //   cb(currentProduct);
//     // });
//   }
//   static deleteById(productId, cb) {
//     getProductsFromFile((products) => {
//       const filteredProducts = products.filter(
//         (product) => product.id !== productId
//       );
//       fs.writeFile(p, JSON.stringify(filteredProducts), (err) => {
//         cb(err);
//       });
//     });
//   }
// };
const { Sequelize, DataTypes, Model, where } = require("sequelize");
const sequelize = require("../util/db");
const { itemPerPage } = require("../util/util");
class Product extends Model {
  static fetchAll(offset = 0) {
    return Product.findAll({
      offset: offset,
      limit: itemPerPage,
    });
  }
  static getTotatNoOfProducts() {
    return Product.count();
  }
  static getProductById(productId) {
    return Product.findByPk(productId);
  }
  static getProductByIdAndUserId(productId, userId) {
    return Product.findOne({
      where: {
        id: productId,
        userId: userId,
      },
    });
  }
  static save(product) {
    if (product.id) {
      return Product.update(product, {
        where: {
          id: product.id,
        },
      });
    }
    return Product.create(product);
  }
  static deleteById(productId, userId) {
    return Product.destroy({
      where: {
        id: productId,
        userId: userId,
      },
    });
  }
}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "product",
  }
);

module.exports = Product;
