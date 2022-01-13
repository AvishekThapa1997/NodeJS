import express from "express";
import * as feedController from "../controller/feedController.js";
const router = new express.Router();
router.get("/posts", feedController.getPosts);
router.post("/post", feedController.createPost);
export default router;
