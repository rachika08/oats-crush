import express from "express";

import {getAllOrders,getOrderByIdAdmin,updateOrderStatus} from "../controllers/adminOrderController.js";

import {protect} from '../midleware/protect.js';
import {admin} from '../midleware/adminOnly.js'
import { getDashboardStats } from "../controllers/adminDashboardController.js";

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

router.get(
    "/dashboard-stats",
    protect,
    admin,
    getDashboardStats
);

export default router;