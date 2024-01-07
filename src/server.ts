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
import { verifyToken, verifyTokenWs } from "../middleware/authMiddleware";
import path from "path";
import User from "../Models/UserModel";
import Post from "../Models/PostModel";
import { posts, users } from "../data/mock";
import ws from 'ws';

dotenv.config()
const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'))
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }))
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

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
    const fileExtension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + fileExtension);
  }
})
const upload = multer({storage: storage})

app.post("/auth/register", upload.single('file'), register)
app.post("/posts", verifyToken, upload.single('file'), createPost)

//routes
app.use('/auth', authRoutes)
app.use('/users', userRoutes)
app.use('/posts', postRoutes)

const port = process.env.PORT || 8080
const server = app.listen(port, ()=>{
  console.log(`Start server at port : ${port}`)
  // User.insertMany(users);
  // Post.insertMany(posts);
})
const wss = new ws.WebSocketServer({ server })

wss.on('connection', (connection, req) => {
  if (req.url) {
    const token = req.url.split('=')[1]
    const userId = verifyTokenWs(token)
    if (userId) {
      console.log('wss connect id:', userId)
    } else {
      connection.on('close', () => {
        console.log('wss connection unauthorized. Closing connection.');
      });
    }
  
    connection.on('close', () => {
      console.log('wss disconnected');
    });
  } else {
    connection.on('close', () => {
      console.log('wss connection unauthorized. Closing connection.');
    });
  }
})