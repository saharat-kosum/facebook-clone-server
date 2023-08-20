import express from "express"
import {
  getUser,
  getUserFriends,
  addRemoveFriend
} from "../Controllers/userController"
import { verifyToken } from "../middleware/authMiddleware"

const router = express.Router()

router.get("/:id", verifyToken, getUser)
router.get("/:id/friends", verifyToken, getUserFriends)
router.put("/:id/:friendId", verifyToken, addRemoveFriend)

export default router