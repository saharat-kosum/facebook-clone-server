import { NextFunction } from 'express'
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken'

export const verifyToken = async (req: Request, res:Response, next: NextFunction) => {
  try {
    const header = req.header("Authorization")

    if(!header){
      return res.status(400).send("Access Denied")
    }

    if(header.startsWith("Bearer ")){
      const token = header.slice(7)
      if(process.env.JWT_SECRET){
        const verified = jwt.verify(token, process.env.JWT_SECRET)
        next()
      }
    }
  }
  catch (err) {
    console.error('Verify Token error: ', err)
    res.status(500).json({error : 'Internal server error'})
  }
}