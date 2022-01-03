const bcryptjs = require("bcryptjs");
const User = require("../models/user");
exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    errorMessage: req.flash("invalidCredentials")[0],
  });
};

exports.getSignUp = (req, res, next) => {
  res.render("auth/sign-up", {
    path: "/sign-up",
    pageTitle: "Sign Up",
    errorMessage: req.flash("error")[0],
  });
};
exports.postLogin = (req, res, next) => {
  const { email, password } = req.body;
  let _user;
  let _passwordMatched;
  User.findUserByEmail(email)
    .then((user) => {
      if (user) {
        _user = user;
        return bcryptjs.compare(password, user.password);
      }
      return false;
    })
    .then((passwordMatched) => {
      _passwordMatched = passwordMatched;
      if (!passwordMatched) {
        return;
      }
      req.session.userId = _user.id;
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      if (_user && _passwordMatched) {
        req.session.save((err) => {
          res.redirect("/");
        });
      } else {
        req.flash("invalidCredentials", "Invalid Email or Password");
        req.session.save((err) => {
          res.redirect("/login");
        });
      }
    });
  //   res.setHeader("Set-Cookie", "isLoggedIn=true"); // Setting Cookie
};

exports.postSignUp = (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body;
  User.findUserByEmail(email)
    .then((user) => {
      if (user) {
        throw err;
      }
      return bcryptjs.hash(password, 12);
    })
    .then((hashedPassword) => {
      return User.save({
        name: name,
        email: email,
        password: hashedPassword,
      });
    })
    .then((user) => {
      if (user) {
        req.session.userId = user.id;
      }
      req.session.save(() => {
        res.redirect("/");
      });
    })
    .catch((err) => {
      req.flash("error", "Email Already Exists!");
      req.session.save(() => {
        res.redirect("/sign-up");
      });
    });
};
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (!err) {
      res.redirect("/");
    }
  });
};
