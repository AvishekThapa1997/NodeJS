import { validationResult } from "express-validator";
import * as util from "../util.js";
export const bodyValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(
      errors.array({
        onlyFirstError: true,
      })
    );
    util.throwError(422, "Validation failed,entered data is incorrect");
  }
  next();
};
