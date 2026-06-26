import express from "express";
import { postReviews, getProductReviews} from "../controllers/reviewController.js";
import { protect } from "../midleware/protect.js";

const router = express.Router();

router.post("/:productId", protect, postReviews);
router.get("/:productId",getProductReviews);

export default router;