import express from "express";
import jwt from "jsonwebtoken";
import cors from 'cors'
import dotenv from 'dotenv'
import morgan from "morgan";
import helmet from 'helmet'
import multer from "multer";
import mongoose from "mongoose";
import { register } from "../Controllers/authController";
import { createPost } from "../Controllers/postController";
import authRoutes from "../Routes/authRoute"
import userRoutes from "../Routes/userRoute"
import postRoutes from "../Routes/postRoute"
import { verifyToken } from "../middleware/authMiddleware";

dotenv.config()
const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'))
app.use(helmet())
// app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }))

//connect database
if(process.env.DATABASE){
  mongoose.connect(process.env.DATABASE)
  .then(()=>{
    console.log("DATABASE Connected")
  }).catch((error:Error)=>{
    console.log('Cant connect to database',error)
  })
}

//upload picture
const storage = multer.diskStorage({
  destination: function (req, file, cb){
    cb(null,'uploads/')
  },
  filename: function (req, file, cb){
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})
const upload = multer({storage: storage})

app.post("/auth/register", upload.single("picture"), register)
app.post("/posts", verifyToken, upload.single("picture"), createPost)

//routes
app.use('/auth', authRoutes)
app.use('/users', userRoutes)
app.use('/posts', postRoutes)

const port = process.env.PORT || 8080
app.listen(port, ()=>{
  console.log(`Start server at port : ${port}`)
})