

// controller for user registration
// POST : /api/Users/register


import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Resume from "../models/Resume.js";

const generateToken = (userId)=>{
    const token = jwt.sign({userId},process.env.JWT_SECRET, {expiresIn: '7d'} )
    return token;
}

export const registerUser = async(req , res) => {
    try {
        const {name, email, password} = req.body;

// Check if req fields are present
        if(!name || !email || !password){
            return res.status(400).json({message: 'Missing required fields'})
        }

        // check if user already exists
        const user = await User.findOne({email})
        if(user){
            return res.status(400).json({message: 'User already exists'})
        }

        // create new password 
        const hashedPassword = await bcrypt.hash(password , 10)
        const newUser = await User.create({
            name,email,password: hashedPassword
        })

        // return token success message
        const token = generateToken(newUser._id)
        newUser.password = undefined ;

        return res.status(201).json({message:'user created successfully ', token, user:newUser})

    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}


// controller for user login
// POST : /api/Users/register

export const loginUser = async(req , res) => {
    try {
        const {email, password} = req.body;

        // check if user already exists
        const user = await User.findOne({email})
        if(user){
            return res.status(400).json({message: 'Invalid email or password'})
        }

// check if password is correct
if(!user.comparePassword()){
    return  res.status(400).json({message: 'Invalid email or password'})
}

// generate token if its correct
        const token = generateToken(user._id)
        user.password = undefined ;

        return res.status(200).json({message:'login successfully ', token, user:user})

    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}

// controller for getting user id 
// get: /api/users/data

export const getUserById = async(req , res) => {
    try {
       
        const userId = req.userId;

        // check user exists by id
        const user = await User.findById(userId)
        if(!user){
             return res.status(400).json({message: 'user not found'})
        }
        // return password
        
        user.password = undefined;
        return res.status(200).json({user})

    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}

// controller for getting user resume
// get: /api/users/resume
export const getUserResumes = async (req,res) => {
    try {
        const userId = req.userId;

        //return user resume
        const resumes = await Resume.find({userId})
        return res.status(200).json({resumes})

    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}