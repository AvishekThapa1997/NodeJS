const { DataTypes, Model } = require("sequelize");
const sequelize = require("../util/db");
class Order extends Model {}
Order.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
  },
  {
    sequelize,
    modelName: "order",
  }
);
module.exports = Order;
