import express from 'express';
const app=express();
import connectDB from './config/mongo.js';
import cors from 'cors';
import dotenv from 'dotenv';
import cleanupPendingOrders from "./jobs/cleanupPendingOrders.js";
import authRoutes from './routes/authRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import addressRoutes from './routes/addressRoutes.js';
import paymentRoutes from "./routes/paymentRoutes.js";
import orderRoutes from './routes/orderRoutes.js';
import adminOrderRoutes from './routes/adminOrderRoutes.js'
dotenv.config();

app.use(express.urlencoded({extended:true}));
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/category',categoryRoutes);
app.use('/api/product',productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/order",orderRoutes);
app.use("/api/payment",paymentRoutes);
app.use("/api/admin",adminOrderRoutes);


app.get('/',(req,res)=>{
    res.send("hi");
})

connectDB();
cleanupPendingOrders();

app.listen(process.env.PORT,()=>{
    console.log("server listening");
})