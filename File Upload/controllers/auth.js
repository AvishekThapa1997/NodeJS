const crypto = require("crypto");
const bcryptjs = require("bcryptjs");
const User = require("../models/user");
const Token = require("../models/token");
const mailService = require("../service/mail");
const { validationResult } = require("express-validator");
const { separateValidationError } = require("../util/util");
const { showError } = require("../util/showError");
exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    errorMessage: req.flash("invalidCredentials")[0],
    successMessage: req.flash("success")[0],
    prevInput: null,
    validationErrors: null,
  });
};

exports.getSignUp = (req, res, next) => {
  res.render("auth/sign-up", {
    path: "/sign-up",
    pageTitle: "Sign Up",
    errorMessage: req.flash("error")[0],
    prevInput: null,
    validationErrors: null,
  });
};

exports.getResetPassword = (req, res, next) => {
  res.render("auth/reset", {
    path: "/reset-password",
    pageTitle: "Reset Password",
    errorMessage: req.flash("error")[0],
  });
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  Token.findByRefreshToken(token)
    .then((tokenModel) => {
      if (!tokenModel) {
        return null;
      }
      return tokenModel.getUser();
    })
    .then((user) => {
      if (!user) {
      }
      res.render("auth/new-password", {
        path: "/new-password",
        pageTitle: "New Password",
        errorMessage: req.flash("error")[0],
        userId: user.id,
        passwordToken: token,
      });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postNewPassword = (req, res, next) => {
  const { userId, passwordToken, password } = req.body;
  let tokenId;
  Token.findByRefreshTokenWithUserId(passwordToken, userId)
    .then((tokenModel) => {
      if (!tokenModel) {
        return null;
      }
      refreshToken = tokenModel.id;
      return bcryptjs.hash(password, 12).then();
    })
    .then((hashedPassword) => {
      if (!hashedPassword) {
        return null;
      }
      return User.updateUser(
        {
          password: hashedPassword,
        },
        userId
      );
    })
    .then((user) => {
      if (!user) {
        req.flash("error", "Something Went Wrong!");
        req.session.save(() => {
          res.redirect("/login");
        });
        return;
      }
      req.flash("success", "Password Updated Successfully");
      req.session.save(() => {
        res.redirect("/login");
        Token.deleteToken(tokenId);
      });
    })
    .catch((err) => next(err));
};
exports.postResetPassword = (req, res, next) => {
  const { email } = req.body;
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset-password");
    }
    const token = buffer.toString("hex");
    User.findUserByEmail(email)
      .then((user) => {
        if (!user) {
          req.flash("error", "User Does not Exist");
          return;
        }
        return user.createToken({
          refreshToken: token,
          refreshTokenExpiration: Date.now() + 3600000,
        });
      })
      .then((token) => {
        if (!token) {
          req.session.save(() => {
            res.redirect("/reset-password");
          });
        } else {
          res.redirect("/");
          mailService.sendMail({
            to: email,
            from: "bori32@readod.site",
            subject: "Password Reset",
            text: "You successfully signed up!",
            html: `
          <p>You requested a password reset!</p>
          <p>Click this <a href="http://localhost:3000/reset-password/${token.refreshToken}">link</a> to set a new password</p>
          `,
          });
        }
      })
      .catch((err) => next(err));
  });
};
exports.postLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const validationErrors = separateValidationError(
      errors.array({
        onlyFirstError: true,
      })
    );
    return res.status(422).render("auth/login", {
      path: "/login",
      pageTitle: "Login",
      errorMessage: errors.array().at(0)?.msg,
      successMessage: null,
      prevInput: {
        email,
        password,
      },
      validationErrors: validationErrors,
    });
  }
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
      if (!passwordMatched) {
        return;
      }
      _passwordMatched = passwordMatched;
      req.session.userId = _user.id;
      if (_user && _passwordMatched) {
        req.session.save((err) => {
          res.redirect("/");
        });
      } else {
        res.render("auth/login", {
          path: "/login",
          pageTitle: "Login",
          errorMessage: "Invalid Email or Password",
          successMessage: null,
          prevInput: {
            email,
            password,
          },
          validationErrors: null,
        });
      }
    })
    .catch((err) => {
      next(err);
    });
  //   res.setHeader("Set-Cookie", "isLoggedIn=true"); // Setting Cookie
};

exports.postSignUp = (req, res, next) => {
  const errors = validationResult(req);
  const { name, email, password, confirmPassword } = req.body;
  if (!errors.isEmpty()) {
    const validationErrors = separateValidationError(
      errors.array({
        onlyFirstError: true,
      })
    );
    return res.status(422).render("auth/sign-up", {
      path: "/sign-up",
      pageTitle: "Sign Up",
      errorMessage: errors.array().at(0)?.msg,
      prevInput: { name, email, password, confirmPassword },
      validationErrors: validationErrors,
    });
  }
  bcryptjs
    .hash(password, 12)
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
        mailService
          .sendMail({
            to: user.email,
            from: "bori32@readod.site",
            subject: "Signup Successfully",
            text: "You successfully signed up!",
            html: "<h1>You successfully signed up</h1>",
          })
          .catch((err) => {
            console.log(err);
          });
      });
    })
    .catch((err) => {
      // req.flash("error", "Email Already Exists!");
      // req.session.save(() => {
      res.redirect("/sign-up");
      // });
    });
};
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (!err) {
      res.redirect("/");
    }
  });
};
