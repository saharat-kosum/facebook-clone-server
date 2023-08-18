import express from "express"
import { login } from "../Controllers/authController"

const router = express.Router()

router.post("/login", login)

export default router