import express from "express";
import { placeOrder } from "../controllers/orderController.js";
import { protect } from "../midleware/protect.js";

const router=express.Router();

router.post('/',protect,placeOrder);

export default router;