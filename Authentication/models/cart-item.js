const { DataTypes, Model } = require("sequelize");
const sequelize = require("../util/db");
class CartItem extends Model {}
CartItem.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
    },
  },
  {
    sequelize,
    modelName: "cartItem",
  }
);
module.exports = CartItem;
