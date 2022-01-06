const { DataTypes, Model, Op } = require("sequelize");
const sequelize = require("../util/db");

class Token extends Model {
  static findByRefreshToken(token) {
    return Token.findOne({
      where: {
        refreshToken: token,
        refreshTokenExpiration: {
          [Op.gt]: Date.now(),
        },
      },
    });
  }
  static findByRefreshTokenWithUserId(token, userId) {
    return Token.findOne({
      where: {
        refreshToken: token,
        refreshTokenExpiration: {
          [Op.gt]: Date.now(),
        },
        userId: userId,
      },
    });
  }
  static deleteToken(tokenId) {
    Token.destroy({
      where: {
        id: id,
      },
    });
  }
}

Token.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    refreshToken: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    refreshTokenExpiration: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "token",
  }
);
module.exports = Token;
