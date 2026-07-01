import express from "express";
import { addToCart, getCart,updateCartItem,removeCartItem,addCustomBox , removeCustomBox} from "../controllers/cartController.js";
import { protect } from "../midleware/protect.js"

const router = express.Router();

router.get('/',protect,getCart)
router.post("/add", protect, addToCart);
router.put("/update", protect, updateCartItem);
router.delete("/remove/:itemId", protect, removeCartItem);
router.post(
    "/add-custom-box",
    protect,
    addCustomBox
);
router.delete(
  "/remove-custom-box/:itemId",
  protect,
  removeCustomBox
);
export default router;