const { DataTypes, Model } = require("sequelize");
const sequelize = require("../util/db");
class OrderItem extends Model {}
OrderItem.init(
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
    modelName: "orderItem",
  }
);
module.exports = OrderItem;
