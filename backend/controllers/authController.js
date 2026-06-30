import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library";
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
        if (!userFound.isVerified && userFound.role !=="admin") {
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

const client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID
);

// export const googleLogin = async (req, res) => {
//     try {
//         const { token } = req.body;

//         const ticket = await client.verifyIdToken({
//             idToken: token,
//             audience: process.env.GOOGLE_CLIENT_ID,
//         });

//         const payload = ticket.getPayload();

//         const {
//             sub,
//             email,
//             name,
//             picture,
//         } = payload;

//         let user = await User.findOne({ email });

//         // Existing email/password user
//         if (user && user.authProvider === "local") {
//             user.isVerified = true;
//             await user.save();
//         }

//         // First Google login
//         if (!user) {
//             user = await User.create({
//                 name,
//                 email,
//                 phone: "", // optional fallback
//                 googleId: sub,
//                 avatar: picture,
//                 authProvider: "google",
//                 isVerified: true,
//                 role: "user",
//             });
//         }

//         const jwtToken = jwt.sign(
//             {
//                 id: user._id,
//                 role: user.role,
//             },
//             process.env.JWT_SECRET,
//             {
//                 expiresIn: "7d",
//             }
//         );

//         res.json({
//             message: "Google login successful",
//             token: jwtToken,
//             user: {
//                 id: user._id,
//                 name: user.name,
//                 email: user.email,
//                 role: user.role,
//                 avatar: user.avatar,
//             },
//         });
//     } catch (error) {
//         console.log(error);

//         res.status(500).json({
//             message: "Google authentication failed",
//         });
//     }
// };

export const googleLogin = async (req, res) => {
    try {
        const { token } = req.body;

        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        const { sub, email, name, picture } = payload;

        // 1. Check if user already exists
        let user = await User.findOne({ email });

        // 2. If user exists → LINK GOOGLE ACCOUNT
        if (user) {
            // attach googleId if not present
            if (!user.googleId) {
                user.googleId = sub;
            }

            // update avatar if missing
            if (!user.avatar) {
                user.avatar = picture;
            }

            // ensure verified (Google is trusted)
            user.isVerified = true;

            // OPTIONAL: mark that google is used
            if (user.authProvider === "local") {
                user.authProvider = "local"; // keep as local but linked
            }

            await user.save();
        }

        // 3. If user does NOT exist → CREATE NEW USER
        else {
            user = await User.create({
                name,
                email,
                phone: "", // Google does not provide phone
                googleId: sub,
                avatar: picture,
                authProvider: "google",
                isVerified: true,
                role: "user",
            });
        }

        // 4. Create JWT
        const jwtToken = jwt.sign(
            {
                id: user._id,
                role: user.role,
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );
        
        console.log("Google Payload:", payload);
        console.log("User in DB:", user);

        // 5. Send response
        return res.json({
            message: "Google login successful",
            token: jwtToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
            },
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Google authentication failed",
        });
    }
};