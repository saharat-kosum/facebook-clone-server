import express from "express"
import {
  getFeedPosts,
  getUserPosts,
  likePost
} from "../Controllers/postController"
import { verifyToken } from "../middleware/authMiddleware"

const router = express.Router()

router.get("/", verifyToken, getFeedPosts)
router.get("/:userId/posts", verifyToken, getUserPosts)
router.put("/:id/like", verifyToken, likePost)

export default router