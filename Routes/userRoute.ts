import express from "express"
import {
  getUser,
  getUserFriends,
  addRemoveFriend,
  getFriendData,
  getUserSuggest
} from "../Controllers/userController"
import { verifyToken } from "../middleware/authMiddleware"

const router = express.Router()

router.get("/", verifyToken, getUser)
router.get("/suggest/friends", verifyToken, getUserSuggest)
router.get("/friend/:id", verifyToken, getFriendData)
router.get("/:id/friends", verifyToken, getUserFriends)
router.put("/:id/:friendId", verifyToken, addRemoveFriend)

export default router