import express from "express";
import { createRazorpayOrder } from "../controllers/paymentController.js";
import {protect} from "../midleware/protect.js";

const router = express.Router();

router.post(
    "/create-order",
    protect,
    createRazorpayOrder
);

export default router;