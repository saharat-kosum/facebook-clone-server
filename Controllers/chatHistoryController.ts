import mongoose from "mongoose";
import { Request, Response } from 'express';
import ChatHistory from "../Models/ChatHistoryModel";

export const getChats = async (req:Request, res: Response) => {
  try{
    const { id } = res.locals.id
    const { targetUserId } = req.params
    const chats = await ChatHistory.find({
      $or: [
        { sender: id, receiver: targetUserId },
        { sender: targetUserId, receiver: id },
      ],
    })
      .sort({ createdAt: 'asc' })
      .exec();
    res.status(200).json(chats)
  }
  catch (err) {
    console.error('Get chat error: ', err)
    res.status(404).json({error : 'Get chat error'})
  }
}