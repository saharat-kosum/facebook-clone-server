import express from "express";
import jwt from "jsonwebtoken";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import multer from "multer";
import mongoose from "mongoose";
import { register } from "../Controllers/authController";
import { createPost } from "../Controllers/postController";
import authRoutes from "../Routes/authRoute";
import userRoutes from "../Routes/userRoute";
import postRoutes from "../Routes/postRoute";
import chatHistoryRoutes from "../Routes/chatHistoryRoute";
import { verifyToken, verifyTokenWs } from "../middleware/authMiddleware";
import path from "path";
import User from "../Models/UserModel";
import Post from "../Models/PostModel";
// import { posts, users } from "../data/mock";
import ws from "ws";
import { ChatHistoryType } from "../Type";
import ChatHistory from "../Models/ChatHistoryModel";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

//connect database
if (process.env.DATABASE) {
  mongoose
    .connect(process.env.DATABASE)
    .then(() => {
      console.log("DATABASE Connected");
    })
    .catch((error: Error) => {
      console.log("Cant connect to database", error);
    });
}

//upload picture
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + fileExtension);
  },
});
const upload = multer({ storage: storage });

app.post("/auth/register", upload.single("file"), register);
app.post("/posts", verifyToken, upload.single("file"), createPost);

//routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use("/chats", chatHistoryRoutes);

const port = parseInt(process.env.PORT || "8080", 10);
const server = app.listen(port, "0.0.0.0", () => {
  console.log(`Start server at port : ${port}`);
  // User.insertMany(users);
  // Post.insertMany(posts);
});
const wss = new ws.WebSocketServer({ server });

const clients = new Map<string, ws>();

wss.on("connection", (connection, req) => {
  if (req.url && req.url.includes("=")) {
    const token = req.url.split("=")[1];
    const userId = verifyTokenWs(token);
    if (userId) {
      console.log("wss connect id:", userId);
      clients.set(userId, connection);

      // Add message event listener
      connection.on("message", async (data: string) => {
        const { message, receiver } = JSON.parse(data) as ChatHistoryType;
        // console.log(`Received message from user ${userId}: ${message}`);
        if (message && receiver) {
          const targetSocket = clients.get(receiver);
          if (targetSocket) {
            const sendPayload: ChatHistoryType = {
              sender: userId,
              receiver,
              message: message,
            };
            await ChatHistory.create(sendPayload);
            targetSocket.send(JSON.stringify(sendPayload));
          }
        }
      });
    } else {
      connection.close();
    }
  } else {
    connection.close();
  }

  connection.on("close", () => {
    console.log("wss disconnected");
  });
});
