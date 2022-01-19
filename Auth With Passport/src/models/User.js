import { Model, DataTypes } from "sequelize";
import dbConnection from "../config/db/dbConfig.js";
class User extends Model {
  static findUserByUsername(username) {
    return User.findOne({
      where: {
        username: username,
      },
    });
  }
  static findUserById(id) {
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
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    admin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    sequelize: dbConnection,
    modelName: "user",
  }
);

export default User;
