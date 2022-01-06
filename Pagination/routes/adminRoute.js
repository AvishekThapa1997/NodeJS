const express = require("express");

const adminController = require("../controllers/admin");
const { body } = require("express-validator");
const router = express.Router();
const MESSAGE = require("../util/message");
const {
  productValidationMiddleware,
} = require("../middleware/productValidationMiddleware");
// /admin/add-product => GET
router.get("/add-product", adminController.getAddProduct);

// /admin/products => GET
router.get("/products", adminController.getProducts);

// /admin/add-product => POST
router.post(
  "/add-product",
  [
    body(["title", "price", "description"], MESSAGE.invalidInput)
      .trim()
      .notEmpty(),
    body("title")
      .isLength({
        min: 3,
      })
      .withMessage(MESSAGE.invalidTitle),
    body("price", MESSAGE.invalidPrice).isFloat({
      min: 0.1,
    }),
    body("description")
      .isLength({
        min: 3,
      })
      .withMessage(MESSAGE.invalidDescription),
  ],
  productValidationMiddleware,
  adminController.postAddProduct
);

router.get("/edit-product/:productId", adminController.getEditProduct);

router.post(
  "/edit-product",
  [
    body(["title", "price", "description"], MESSAGE.invalidInput)
      .trim()
      .notEmpty(),
    body("title")
      .isLength({
        min: 3,
      })
      .withMessage(MESSAGE.invalidTitle),
    body("price", MESSAGE.invalidPrice).isFloat({
      min: 0.1,
    }),
    body("description")
      .isLength({
        min: 3,
      })
      .withMessage(MESSAGE.invalidDescription),
  ],
  productValidationMiddleware,
  adminController.postEditProduct
);

router.post("/delete-product", adminController.deleteProduct);

router.delete("/product/:productId", adminController.deleteProduct);

module.exports = router;
