import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const signUpUser=async (req,res) => {
    try {
        let {name,email,password,phone}=req.body;
        const userExist=await User.findOne({email});

        if(userExist){
            return res.status(400).json({ message: "User already exists" });
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