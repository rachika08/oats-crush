import mongoose from "mongoose";
import User from '../models/User.js';
import dotenv from 'dotenv';
import bcrypt from "bcryptjs";

dotenv.config({ path: "../.env" });
const admin=async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL);
        const hashPassword=await bcrypt.hash("admin123",10);
        await User.create({
            name:"admin",
            email:"admin@gmail.com",
            password:hashPassword,
            phone:"9987654321",
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