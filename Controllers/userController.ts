import mongoose from "mongoose";
import User from "../Models/UserModel"
import { Request, Response } from 'express';

export const getUser = async (req:Request, res: Response) => {
  try{
    const { id } = res.locals.id
    const user = await User.findById(id)
    res.status(200).json(user)
  }
  catch (err) {
    console.error('Get user error: ', err)
    res.status(404).json({error : 'Get user error'})
  }
}

export const getFriendData = async (req:Request, res: Response) => {
  try{
    const { id } = req.params
    const user = await User.findById(id)
    res.status(200).json(user)
  }
  catch (err) {
    console.error('Get user error: ', err)
    res.status(404).json({error : 'Get user error'})
  }
}

export const getUserFriends = async (req:Request, res: Response) => {
  try{
    const { id } = req.params
    const user = await User.findById(id)
    const friends = await User.find({_id: { $in: user?.friends }})
    res.status(200).json(friends)
  }
  catch (err) {
    console.error('Get user friends error: ', err)
    res.status(404).json({error : 'Get user friends error'})
  }
}

export const getUserSuggest = async (req:Request, res: Response) => {
  try{
    const { id } = res.locals.id
    const user = await User.findById(id)
    if (user && user.friends) {
      const nonFriends = await User.find({ _id: { $nin: [...user.friends, id] } });
      const shuffledNonFriends = shuffleArray(nonFriends);
      const limit = 3;
      const randomNonFriends = shuffledNonFriends.slice(0, limit);
      res.status(200).json(randomNonFriends);
    } else {
      res.status(200).json([]);
    }
  }
  catch (err) {
    console.error('Get user friends error: ', err)
    res.status(404).json({error : 'Get user friends error'})
  }
}

export const addRemoveFriend = async (req:Request, res: Response) => {
  try{
    const { id ,friendId } = req.params
    const user = await User.findById(id)
    const friend = await User.findById(friendId)

    if(user && friend){
      if(user?.friends.includes(friendId)){
        user.friends = user.friends.filter((id)=> id !== friendId)
        friend.friends = friend.friends.filter((friendID)=> friendID !== id)
      }else{
        user.friends.push(friendId)
        friend.friends.push(id)
      }
      await user.save()
      await friend.save()
      console.log('Add/Remove friend success')
      res.status(200).json({message : 'Add/Remove friend success'})
    }else{
      res.status(404).json({error : 'Cant find data'})
    }
  }
  catch (err) {
    console.error('Add/Remove friend error: ', err)
    res.status(404).json({error : 'Add/Remove friend error'})
  }
}

export const searchUser = async (req: Request, res: Response) => {
  try{
    const userName = req.query.search as string
    if (!userName) {
      res.status(400).json({error: 'Query search is required'})
    }

    const regex = new RegExp(userName, 'i')

    const users = await User.find({
      $or: [
        { firstName: { $regex: regex } },
        { lastName: { $regex: regex } }
      ]
    })

    res.status(200).json({ users })
  }
  catch (err) {
    console.error('Search user error: ', err)
    res.status(404).json({error : 'Search user error'})
  }
}

function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}