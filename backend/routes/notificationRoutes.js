import express from "express";
import { notifyMe } from "../controllers/notificationController.js";
import { protect } from "../midleware/protect.js";

const router = express.Router();

router.post("/notify", protect, notifyMe);

export default router;