import express from 'express';
import { createProduct, getProducts, getProductsById,updateProduct,deleteProduct } from '../controllers/productController.js';

const router=express.Router();

router.get('/',getProducts);
router.get('/:id',getProductsById);
router.post('/',createProduct);
router.put('/:id',updateProduct);
router.delete('/:id',deleteProduct);

export default router;