const express = require("express");

const authController = require("../controllers/auth");
const authRouter = new express.Router();
authRouter.get("/login", authController.getLogin);
authRouter.post("/login", authController.postLogin);
authRouter.get("/logout", authController.logout);
module.exports = authRouter;
