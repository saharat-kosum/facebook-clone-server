import express from "express"
import {
  commentPost,
  deletePost,
  getFeedPosts,
  getUserPosts,
  likePost
} from "../Controllers/postController"
import { verifyToken } from "../middleware/authMiddleware"

const router = express.Router()

router.get("/", verifyToken, getFeedPosts)
router.get("/:userId/posts", verifyToken, getUserPosts)
router.put("/:id/like", verifyToken, likePost)
router.delete("/delete/:_id", verifyToken, deletePost)
router.post("/add/comment/:id", verifyToken, commentPost)

export default router