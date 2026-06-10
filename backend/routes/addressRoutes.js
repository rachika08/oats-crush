import express from "express";
import {
  addAddress,
  getAddresses,
} from "../controllers/addressController.js";
import { protect } from "../midleware/protect.js";

const router = express.Router();

router.post("/", protect, addAddress);
router.get("/", protect, getAddresses);

export default router;