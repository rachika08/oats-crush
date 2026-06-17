import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail.js";


export const signUpUser = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        const userExist = await User.findOne({ email });

        if (userExist) {
            return res.status(409).json({
                message: "User already exists",
            });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const verificationToken =
            crypto.randomBytes(32).toString("hex");

        const user = await User.create({
            name,
            email,
            password: hashPassword,
            phone,
            role: "user",
            isVerified: false,
            verificationToken,
            verificationTokenExpires:
                Date.now() + 24 * 60 * 60 * 1000,
        });

        const verificationUrl =
            `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;
        console.log("About to send email");
        await sendEmail(
            email,
            "Verify Your Email",
            `
            <h2>Welcome to OatsCrush</h2>

            <p>Please verify your email by clicking below:</p>

            <a href="${verificationUrl}">
                Verify Email
            </a>

            <p>This link expires in 24 hours.</p>
            `
        );
        console.log("email sent")
        res.status(201).json({
            message:
                "Registration successful. Please verify your email.",
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error",
        });
    }
};

export const loginUser=async(req,res)=>{
    try {
        const {email,password}=req.body;
        let userFound=await User.findOne({email});
        if(!userFound){
            return res.status(400).json({message:"user not found"});
        }
        if (!userFound.isVerified) {
            return res.status(403).json({
                message:
                    "Please verify your email before logging in"
            });
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

export const verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;

        const user = await User.findOne({
            verificationToken: token,
            verificationTokenExpires: {
                $gt: Date.now(),
            },
        });

        if (!user) {
            return res.status(400).json({
                message: "Invalid or expired token",
            });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpires = undefined;

        await user.save();

        res.json({
            message: "Email verified successfully",
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
        });
    }
};

