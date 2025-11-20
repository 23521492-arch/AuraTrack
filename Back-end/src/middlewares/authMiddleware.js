import jwt from 'jsonwebtoken';
import User from '../models/User.js';

//authorization-who is user?
export const protectedRoute = async (req,res,next) =>{
    try {
        //Take token from header
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

        if(!token){
            return res.status(401).json({message: 'No access token found'});
        }

        //Verify token
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decodedUser)=>{
            if(err){
                console.error( err);
                return res.status(403).json({message: 'Invalid or expire access token'});
            }
        })
        
        //Find user
        const user = await User.findById(decodedUser.userId).select('-hashedPassword');

        if(!user){
            return res.status(404).json({message: 'User not found'});
        }

        //Send user in req
        req.user = user;
        next();
        
    } catch (error) {
        console.error('Error in authorizing jwt in authMiddleware',error);
        res.status(500).json({message: 'System error'});
    }
};
