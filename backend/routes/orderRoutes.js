import express from "express";
import { placeOrder,getOrders,getOrderById,cancelOrder } from "../controllers/orderController.js";
import { protect } from "../midleware/protect.js";

const router=express.Router();

router.post('/',protect,placeOrder);
router.get('/',protect,getOrders);
router.get('/:id',protect,getOrderById);
router.put( "/:id/cancel",protect,cancelOrder);

export default router;