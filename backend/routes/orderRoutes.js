import express from "express";
import { placeOrder,getOrders,getOrderById } from "../controllers/orderController.js";
import { protect } from "../midleware/protect.js";

const router=express.Router();

router.post('/',protect,placeOrder);
router.get('/',protect,getOrders);
router.get('/:id',protect,getOrderById);

export default router;