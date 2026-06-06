import express from 'express';
const app=express();
import connectDB from './config/mongo.js';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js'
import categoryRoutes from './routes/categoryRoutes.js'

dotenv.config();

app.use(express.urlencoded({extended:true}));
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/category',categoryRoutes);

app.get('/',(req,res)=>{
    res.send("hi");
})

connectDB();

app.listen(process.env.PORT,()=>{
    console.log("server listening");
})