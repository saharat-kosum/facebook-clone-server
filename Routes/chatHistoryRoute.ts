import express from "express"
import {
  getChats
} from "../Controllers/chatHistoryController"
import { verifyToken } from "../middleware/authMiddleware"

const router = express.Router()

router.get("/:targetUserId", verifyToken, getChats)

export default router