import express from 'express';
import { createProduct, getProducts, getProductsById,updateProduct,deleteProduct } from '../controllers/productController.js';
import { protect } from '../midleware/protect.js';
import { admin } from '../midleware/adminOnly.js';
import {upload} from '../midleware/upload.js'
const router=express.Router();

router.get('/',getProducts);
router.get('/:id',getProductsById);
router.post('/',protect,admin,upload.single("image"),createProduct);
router.put('/:id',protect,admin,updateProduct);
router.delete('/:id',protect,admin,deleteProduct);

export default router;