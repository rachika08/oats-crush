import express from "express";
import { signUpUser , loginUser,googleLogin, getUsers, verifyEmail} from "../controllers/authController.js";
import { protect } from "../midleware/protect.js";
import { admin } from "../midleware/adminOnly.js";
const router=express.Router();

router.post("/signup",signUpUser);
router.post("/login",loginUser);
router.post("/google", googleLogin);
router.get('/users',protect,admin,getUsers);
router.get("/verify-email/:token",verifyEmail);
export default router;