const { DataTypes, Model } = require("sequelize");
const sequelize = require("../util/db");
class Order extends Model {
  static findById(id) {
    return Order.findByPk(id);
  }
}
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
