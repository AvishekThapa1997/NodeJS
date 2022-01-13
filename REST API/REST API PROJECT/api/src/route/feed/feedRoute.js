import express from "express";
import { body } from "express-validator";
import * as feedController from "../../controller/feed/feedController.js";
import { bodyValidation } from "../../utils/validation/bodyValidation.js";
import authMiddleware from "../../middleware/auth/authMiddleware.js";
import MESSAGE from "../../utils/validation/message.js";
const router = new express.Router();
router.get("/posts", authMiddleware, feedController.getPosts);
router.post(
  "/post",
  authMiddleware,
  [
    body(["title", "content"], MESSAGE.emptyInput)
      .trim()
      .notEmpty(),
    body("title")
      .isLength({
        min: 6,
      })
      .withMessage(MESSAGE.invalidTitle),
    body("content")
      .isLength({
        min: 6,
      })
      .withMessage(MESSAGE.invalidContent),
  ],
  bodyValidation,
  feedController.createPost
);
router.get("/status", authMiddleware, feedController.getUserStatus);
router.put("/status", authMiddleware, feedController.updateStatus);
router.get("/post/:postId", authMiddleware, feedController.getPost);
router.put(
  "/post/:postId",
  authMiddleware,
  [
    body(["title", "content"], MESSAGE.emptyInput)
      .trim()
      .notEmpty(),
    body("title")
      .isLength({
        min: 6,
      })
      .withMessage(MESSAGE.invalidTitle),
    body("content")
      .isLength({
        min: 6,
      })
      .withMessage(MESSAGE.invalidContent),
  ],
  bodyValidation,
  feedController.updatePost
);
router.delete("/post/:postId", feedController.deletePost);
export default router;
