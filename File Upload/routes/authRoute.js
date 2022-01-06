const express = require("express");
const { body } = require("express-validator");
const authController = require("../controllers/auth");
const authRouter = new express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/user");
const MESSAGE = require("../util/message");
authRouter.get("/login", authMiddleware, authController.getLogin);
authRouter.post(
  "/login",
  [
    body(["email", "password"], MESSAGE.invalidInput).trim().notEmpty(),
    body("email", MESSAGE.invalidEmail).isEmail().normalizeEmail(),
    body("password", MESSAGE.invalidPassword).isLength({
      min: 6,
    }),
  ],
  authController.postLogin
);
authRouter.get("/sign-up", authMiddleware, authController.getSignUp);
authRouter.post("/logout", authController.logout);
authRouter.post(
  "/sign-up",
  [
    body(["name", "email", "password", "confirmPassword"], MESSAGE.invalidInput)
      .trim()
      .notEmpty(),
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage(MESSAGE.invalidEmail)
      .custom((value) => {
        return User.findUserByEmail(value).then((user) => {
          if (user) {
            return Promise.reject("Email already Exits!");
          }
        });
      }),
    body("password", MESSAGE.invalidPassword).isLength({
      min: 6,
    }),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error(MESSAGE.passwordNotMatched);
      }
      return true;
    }),
  ],
  authController.postSignUp
);
authRouter.get(
  "/reset-password",
  authMiddleware,
  authController.getResetPassword
);
authRouter.post("/reset-password", authController.postResetPassword);
authRouter.get("/reset-password/:token", authController.getNewPassword);
authRouter.post("/new-password", authController.postNewPassword);
module.exports = authRouter;
