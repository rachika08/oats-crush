import express from "express";
import { addToCart, getCart,updateCartItem,removeCartItem } from "../controllers/cartController.js";
import { protect } from "../midleware/protect.js"

const router = express.Router();

router.get('/',protect,getCart)
router.post("/add", protect, addToCart);
router.put("/update", protect, updateCartItem);
router.delete("/remove/:productId", protect, removeCartItem);
export default router;