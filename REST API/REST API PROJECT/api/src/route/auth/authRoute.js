import express from "express";
import { bodyValidation } from "../../utils/validation/bodyValidation.js";
import * as authController from "../../controller/auth/authController.js";
import { body } from "express-validator";
import User from "../../model/User.js";
import MESSAGE from "../../utils/validation/message.js";
const router = new express.Router();
router.put(
  "/sign-up",
  [
    body(["email", "name", "password"], MESSAGE.emptyInput)
      .trim()
      .notEmpty(),
    body("email")
      .trim()
      .isEmail()
      .withMessage(MESSAGE.invalidEmail)
      .custom((value) => {
        return authController.checkIfEmailExists(value).then((user) => {
          if (user) {
            return Promise.reject(MESSAGE.emailAlreadyExits);
          }
        });
      })
      .normalizeEmail(),
    body("password")
      .trim()
      .isLength({
        min: 5,
      }),
  ],
  bodyValidation,
  authController.signUpUser
);

router.post("/login", authController.loginUser);
export default router;
