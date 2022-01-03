const path = require("path");

const express = require("express");

const shopController = require("../controllers/shop");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", shopController.getIndex);

router.get("/products", shopController.getProducts);

router.get("/products/:productId", shopController.getProductDetails);

router.get("/cart", authMiddleware, shopController.getCart);

router.post("/cart", authMiddleware, shopController.addProductToCart);

router.post("/cart-delete", authMiddleware, shopController.deleteFromCart);

router.get("/orders", authMiddleware, shopController.getOrders);

router.post("/create-order", authMiddleware, shopController.checkoutProducts);

module.exports = router;
