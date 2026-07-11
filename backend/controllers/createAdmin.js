import mongoose from "mongoose";
import User from '../models/User.js';
import dotenv from 'dotenv';
import bcrypt from "bcryptjs";

dotenv.config({ path: "../.env" });
const admin=async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL);
        const hashPassword=await bcrypt.hash("!@mb@ckhome",11);
        await User.create({
            name:"ARYAN",
            email:"dm@oatscrush.co.in",
            password:hashPassword,
            phone:"9311089539",
            role:"admin"
        });
        console.log("Admin created successfully");
        process.exit();
    } catch (error) {
        console.log(error);
        process.exit();
    }
}

admin();