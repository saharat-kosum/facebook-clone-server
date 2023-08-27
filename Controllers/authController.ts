import User from "../Models/UserModel"
import { Request, Response } from 'express';
import jwt from "jsonwebtoken"


export const register = async (req:Request, res: Response) => {
  try {
    const userData = JSON.parse(req.body.userData);
    const {
      firstName,
      lastName,
      email,
      password,
      dateOfBirth,
      occupation,
      location,
      friends
    } = userData

    let picturePath =''
    if(req.file){
      picturePath = req.file.filename;
    }

    const newUser = new User({
      firstName,
      lastName,
      email,
      password,
      dateOfBirth,
      picturePath,
      occupation,
      location,
      friends
    })

    const saveUser = await newUser.save()
    res.status(200).json(saveUser)

  }
  catch (err) {
    console.error('Create user error: ', err)
    res.status(500).json({error : 'Internal server error'})
  }
}

export const login = async (req:Request, res: Response) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email: email })

    if(!user) {
      return res.status(400).json({ messeage : "User does not exist."})
    }

    if (user.password === password && process.env.JWT_SECRET){
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
      user.password = ''
      return res.status(200).json({token,user})
      
    }else{
      return res.status(400).json({ messeage : "Invalid password."})
    }
  }
  catch (err) {
    console.error('Log in error: ', err)
    res.status(500).json({error : 'Internal server error'})
  }
}