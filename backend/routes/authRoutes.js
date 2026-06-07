import express from "express";
import { signUpUser , loginUser, getUsers} from "../controllers/authController.js";
import { protect } from "../midleware/protect.js";
import { admin } from "../midleware/adminOnly.js";
const router=express.Router();

router.post("/signup",signUpUser);
router.post("/login",loginUser);
router.get('/users',protect,admin,getUsers);
export default router;