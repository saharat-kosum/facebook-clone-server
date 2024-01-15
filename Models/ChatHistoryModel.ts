import mongoose from "mongoose";


const ChatHistorySchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  receiver: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: true
  }
}, {timestamps: true})

const ChatHistory = mongoose.model("ChatHistory", ChatHistorySchema)
export default ChatHistory