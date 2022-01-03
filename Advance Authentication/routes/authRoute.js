const express = require("express");

const authController = require("../controllers/auth");
const authRouter = new express.Router();
const authMiddleware = require("../middleware/authMiddleware");
authRouter.get("/login", authMiddleware, authController.getLogin);
authRouter.post("/login", authController.postLogin);
authRouter.get("/sign-up", authMiddleware, authController.getSignUp);
authRouter.post("/logout", authController.logout);
authRouter.post("/sign-up", authController.postSignUp);
authRouter.get(
  "/reset-password",
  authMiddleware,
  authController.getResetPassword
);
authRouter.post("/reset-password", authController.postResetPassword);
authRouter.get("/reset-password/:token", authController.getNewPassword);
authRouter.post("/new-password", authController.postNewPassword);
module.exports = authRouter;
