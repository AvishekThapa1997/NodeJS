// const mysql = require("mysql2");
// const pool = mysql.createPool({
//   host: "localhost",
//   user: "root",
//   password: "root",
//   database: "nodeshop",
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
// });
// module.exports = pool.promise();

const { Sequelize } = require("sequelize");
const sequelize = new Sequelize("nodeshop", "root", "root", {
  host: "localhost",
  dialect: "mysql",
  define: {
    freezeTableName: true,
  },
});
module.exports = sequelize;
