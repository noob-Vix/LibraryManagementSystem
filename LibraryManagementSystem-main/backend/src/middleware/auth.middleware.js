import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.js';
import User from '../model/user.model.js';

export const authorize = async(req, res, next) =>{
    try {
        let token;

        //Get token from headers
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
            token = req.headers.authorization.split(" ")[1];
        }

        if(!token)return res.status(401).json({success:false,message:"Unauthorized"});

        //verify token
        const decoded = jwt.verify(token,JWT_SECRET);
        //find the user by id
        const user = await User.findById(decoded.userId);

        if(!user)return res.status(401).json({success:false,message:"Unauthorized, User not found"});
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: "Unauthorized",
            error: error.message
        });
    }
 }