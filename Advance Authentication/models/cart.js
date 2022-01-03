const { DataTypes, Model } = require("sequelize");
const sequelize = require("../util/db");
class Cart extends Model {}
Cart.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
  },
  {
    sequelize,
    modelName: "cart",
  }
);
module.exports = Cart;
