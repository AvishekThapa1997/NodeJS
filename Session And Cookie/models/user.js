const { DataTypes, Model } = require("sequelize");
const sequelize = require("../util/db");
class User extends Model {
  static findUserById(id = 1) {
    return User.findByPk(id);
  }
  static save(user) {
    return User.create(user);
  }
}
User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "user",
  }
);
module.exports = User;
