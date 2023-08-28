import Post from "../Models/PostModel";
import User from "../Models/UserModel"
import { Request, Response } from 'express';

export const createPost = async (req:Request , res:Response) => {
  try{
    const postData = JSON.parse(req.body.postData);
    const { userId, description} = postData
    let picturePath =''
    if(req.file){
      picturePath = req.file.filename;
    }

    const user = await User.findById(userId)
    const newPost = new Post({
      userId,
      firstName: user?.firstName,
      lastName: user?.lastName,
      description,
      userPicturePath: user?.picturePath,
      picturePath,
      likes: [],
      comments: []
    })
    await newPost.save()
    const post = await Post.find()
    res.status(200).json(post)
  }
  catch (err) {
    console.error('Create post error: ', err)
    res.status(400).json({error : 'Create post error'})
  }
}

export const getFeedPosts = async (req:Request , res:Response) => {
  try{
    const posts = await Post.find()
    res.status(200).json(posts)
  }
  catch (err) {
    console.error('Get feed post error: ', err)
    res.status(400).json({error : 'Get feed post error'})
  }
}

export const getUserPosts = async (req:Request , res:Response) => {
  try{
    const { userId } = req.params
    const post = await Post.find({userId})
    res.status(200).json(post)
  }
  catch (err) {
    console.error('Get user post error: ', err)
    res.status(400).json({error : 'Get user post error'})
  }
}

export const likePost =async (req:Request , res:Response) => {
  try{
    const { userId } = req.body
    const { id } = req.params
    const post = await Post.findById(id)
    
    if(post){
      const isLiked = post.likes.includes(userId)
      if(isLiked){
        post.likes = post.likes.filter((id) => id !== userId)
      }else{
        post.likes.push(userId)
      }
      const updatedPost = await post.save()
      res.status(200).json(updatedPost)
    }else{
      res.status(404).json({ error: 'Post not found' })
    }
  }
  catch (err) {
    console.error('Cant like post: ', err)
    res.status(400).json({error : 'Cant like post'})
  }
}