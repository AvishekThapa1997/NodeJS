const path = require("path");

const express = require("express");
const csrf = require("csurf");
const bodyParser = require("body-parser");
const session = require("express-session");
const sequelize = require("./util/db");
const User = require("./models/user");
const Product = require("./models/product");
const Cart = require("./models/cart");
const CartItem = require("./models/cart-item");
const Order = require("./models/order");
const OrderItem = require("./models/order-item");
const Token = require("./models/token");
const errorController = require("./controllers/error");
const authMiddleware = require("./middleware/userSessionMiddleware");
const app = express();
const csrfProtection = csrf();
const flash = require("connect-flash");
app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/adminRoute");
const shopRoutes = require("./routes/shopRoute");
const authRoutes = require("./routes/authRoute");
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
//=========================================
app.use(flash());
app.use(csrfProtection);
app.use(express.static(path.join(__dirname, "public")));
// Placed above because it does not require below middleware because authRoutes available only if user not logged in;
app.use("/", (req, res, next) => {
  if (!req.session.userId) {
    return next();
  }
  User.findUserById(req.session.userId)
    .then((user) => {
      req.user = user;
    })
    .finally(() => {
      next();
    });
});
app.use((req, res, next) => {
  res.locals.isLoggedIn = req.user; // locals is object that is shared to all the views
  res.locals.csrfToken = req.csrfToken();
  next();
});
app.use(authRoutes);
app.use("/admin", authMiddleware, adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404);

Product.belongsTo(User, {
  constraints: true,
  onDelete: "CASCADE",
});
User.hasMany(Product);
User.hasMany(Order);
User.hasOne(Cart);
User.hasOne(Token);
Cart.belongsTo(User);
Token.belongsTo(User);
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
