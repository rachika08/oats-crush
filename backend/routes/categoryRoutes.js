import express from "express";
import { createCategory,getCategories,updateCategory,deleteCategory } from "../controllers/categoryController.js";
import { protect } from "../midleware/protect.js";
import { admin } from "../midleware/adminOnly.js";
const router=express.Router();

router.post('/',protect,admin,createCategory);
router.put('/:id',protect,admin,updateCategory);
router.delete('/:id',protect,admin,deleteCategory);
router.get('/',getCategories);
export default router;