import { Model, DataTypes } from "sequelize";
import dbSetUp from "../utils/db/db.js";
class Status extends Model {
  static getStatusOf(userId) {
    return Status.findOne({
      where: {
        userId: userId,
      },
    });
  }
  static getStatusById(statusId) {
    return Status.findByPk(statusId);
  }
  static updateStatus(userId, statusId, status) {
    return Status.update(
      { status: status },
      {
        where: {
          userId: userId,
          _id: statusId,
        },
      }
    );
  }
}
Status.init(
  {
    _id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "I am new user.",
    },
  },
  {
    sequelize: dbSetUp,
    modelName: "status",
    timestamps: false,
  }
);
export default Status;
