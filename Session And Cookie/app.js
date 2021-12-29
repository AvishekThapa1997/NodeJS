const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const sequelize = require("./util/db");
const User = require("./models/user");
const Product = require("./models/product");
const Cart = require("./models/cart");
const CartItem = require("./models/cart-item");
const Order = require("./models/order");
const OrderItem = require("./models/order-item");
const errorController = require("./controllers/error");
const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  session({
    secret: "secret",
    resave: false,
    store: new SequelizeStore({
      db: sequelize,
    }),
    saveUninitialized: false,
  })
); // Session set up for the app
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findUserById(req.session.user.id)
    .then((user) => {
      req.user = user;
    })
    .finally(() => {
      next();
    });
});
//=========================================
app.use(express.static(path.join(__dirname, "public")));
app.use("/admin", adminRoutes);
app.use(authRoutes);
app.use(shopRoutes);
app.use(errorController.get404);
Product.belongsTo(User, {
  constraints: true,
  onDelete: "CASCADE",
});
User.hasMany(Product);
User.hasMany(Order);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
Order.belongsToMany(Product, {
  through: OrderItem,
});
Product.belongsToMany(Order, {
  through: OrderItem,
});
// let _user;
sequelize.sync().then(() => {
  app.listen(3000);
});
// .then(() => {
//   return User.findUserById();
// })
// .then((user) => {
//   if (!user) {
//     return User.save({ name: "Avishek Thapa", email: "abc@gmail.com" });
//   }
//   return user;
// })
// .then((user) => {
//   _user = user;
//   return user.getCart();
// })
// .then((cart) => {
//   if (!cart) {
//     return _user.createCart();
//   }
//   return cart;
// })
// .then((cart) => {
//   app.listen(3000);
// })
// .catch((err) => {
//   console.log(err);
// });
//app.listen(3000);

// db.execute("SELECT * FROM product")
//   .then((data) => {
//     console.log(data[0]);
//   })
//   .catch((err) => {
//     console.log(err);
//   });
