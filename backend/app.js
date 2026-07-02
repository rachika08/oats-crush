import 'dotenv/config';
import express from 'express';
import helmet from "helmet";
const app=express();

app.use(
    helmet({
        contentSecurityPolicy: {
            reportOnly: true,
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: [
                    "'self'",
                    "https://accounts.google.com",
                    "https://apis.google.com"
                ],
                connectSrc: [
                    "'self'",
                    process.env.BACKEND_URL
                ],
                imgSrc: [
                    "'self'",
                    "data:",
                    "https:"
                ],
                styleSrc: [
                    "'self'",
                    "'unsafe-inline'"
                ]
            }
        },

        hsts: {
            maxAge: 31536000,
            includeSubDomains: true,
            preload: true
        },

        frameguard: {
            action: "deny"
        }
    })
);
import connectDB from './config/mongo.js';
import cors from 'cors';

// import "./utils/sendEmail.js";
import cleanupPendingOrders from "./jobs/cleanupPendingOrders.js";
import cartReminderJob from "./jobs/cartReminderJob.js";
import authRoutes from './routes/authRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import addressRoutes from './routes/addressRoutes.js';
import paymentRoutes from "./routes/paymentRoutes.js";
import orderRoutes from './routes/orderRoutes.js';
import adminOrderRoutes from './routes/adminOrderRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import blogRoutes from './routes/blogRoutes.js'

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
app.use("/api/reviews",reviewRoutes);
app.use("/api/blog",blogRoutes);


app.get('/',(req,res)=>{
    res.send("hi");
})

connectDB();
cleanupPendingOrders();
cartReminderJob();

const PORT=process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log("server listening");
})