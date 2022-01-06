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
const multer = require("multer");

const { imageTypes } = require("./util/util");
const filterContent = (req, file, cb) => {
  if (imageTypes.includes(file.mimetype)) {
    cb(null, true);
    return;
  }
  cb(null, false);
};
const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
app.set("view engine", "ejs");
app.set("views", "views");
const adminRoutes = require("./routes/adminRoute");
const shopRoutes = require("./routes/shopRoute");
const authRoutes = require("./routes/authRoute");
const SequelizeStore = require("connect-session-sequelize")(session.Store);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  multer({
    storage: diskStorage,
    fileFilter: filterContent,
  }).single("image")
);
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
app.use("/images", express.static(path.join(__dirname, "images")));
// app.use(express.static(__dirname));
// Placed above because it does not require below middleware because authRoutes available only if user not logged in;
app.use("/", (req, res, next) => {
  if (!req.session.userId) {
    return next();
  }
  User.findUserById(req.session.userId)
    .then((user) => {
      if (user) {
        req.user = user;
      }
    })
    .catch((err) => {
      throw new Error(err);
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
app.get("/500", errorController.get500);
app.use(errorController.get404);
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).render("500", {
    pageTitle: "Error",
    path: "/500",
    isLoggedIn: req.session.userId,
  });
});

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
app.listen(3000, () => {
  sequelize.sync().catch((err) => {
    res.status(500).render("500", {
      pageTitle: "Error",
      path: "/500",
      isLoggedIn: req.session.userId,
    });
  });
});
