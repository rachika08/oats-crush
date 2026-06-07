import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';


export const signUpUser=async (req,res) => {
    try {
        let {name,email,password,phone}=req.body;
        const userExist=await User.findOne({email});

        if(userExist){
            return res.status(409).json({ message: "User already exists" });
        }
        const hashPassword=await bcrypt.hash(password,10);

        await User.create({
            name,
            email,
            password:hashPassword,
            phone,
            role:"user"
        });
        res.json({message:"User registered"});
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
}

export const loginUser=async(req,res)=>{
    try {
        const {email,password}=req.body;
        let userFound=await User.findOne({email});
        if(!userFound){
            return res.status(400).json({message:"user not found"});
        }
        const match=await bcrypt.compare(password,userFound.password);
        if(!match){
            return res.status(400).json({message:"Invalid credentials"});
        }
        const token=jwt.sign(
            {   id:userFound._id,
                role:userFound.role
            },
            process.env.JWT_SECRET,
            {expiresIn:"7d"},
        );
        res.json({
            message:"Login successful!",
            token,
            userFound:{
                id:userFound._id,
                name:userFound.name,
                role:userFound.role,
                email:userFound.email,
            }
        })
    } catch (error) {
    console.error(error);
    return res.status(500).json({
        message: error.message
    });
}
}

export const getUsers=async(req,res)=>{
    try {
        const users=await User.find({});
        res.json(users);
    } catch (error) {
        return res.status(500).json({
        message: error.message
    });
    }
}

