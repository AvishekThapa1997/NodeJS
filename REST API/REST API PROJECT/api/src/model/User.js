import { Model, DataTypes } from "sequelize";
import dbSetUp from "../utils/db/db.js";
class User extends Model {
  static save(newUser) {
    return User.create(newUser);
  }
  static getUserById(userId) {
    return User.findByPk(userId);
  }
  static getUserByEmail(email) {
    return User.findOne({
      where: {
        email: email,
      },
    });
  }
}
User.init(
  {
    _id: {
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
    password: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize: dbSetUp,
    modelName: "user",
    timestamps: false,
  }
);
export default User;
