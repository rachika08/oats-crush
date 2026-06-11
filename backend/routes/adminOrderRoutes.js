import express from "express";

import {getAllOrders,getOrderByIdAdmin,updateOrderStatus} from "../controllers/adminOrderController.js";

import {protect} from '../midleware/protect.js';
import {admin} from '../midleware/adminOnly.js'

const router = express.Router();

router.get(
    "/orders",
    protect,
    admin,
    getAllOrders
);

router.get(
    "/orders/:id",
    protect,
    admin,
    getOrderByIdAdmin
);

router.patch(
    "/orders/:id/status",
    protect,admin,
    updateOrderStatus
);

export default router;