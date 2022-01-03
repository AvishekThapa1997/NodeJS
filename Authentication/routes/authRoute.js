const express = require("express");

const authController = require("../controllers/auth");
const authRouter = new express.Router();
authRouter.get("/login", authController.getLogin);
authRouter.post("/login", authController.postLogin);
authRouter.get("/sign-up", authController.getSignUp);
authRouter.post("/logout", authController.logout);
authRouter.post("/sign-up", authController.postSignUp);
module.exports = authRouter;
