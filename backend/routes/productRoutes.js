import express from 'express';
import { createProduct, getProducts, getUpcomingProducts, getAllProductsAdmin, getProductsById,updateProduct,deleteProduct, featuredProduct,getProductsByCategory } from '../controllers/productController.js';
import { protect } from '../midleware/protect.js';
import { admin } from '../midleware/adminOnly.js';
import {upload} from '../midleware/upload.js'
const router=express.Router();

router.get('/',getProducts);
router.get('/upcoming', getUpcomingProducts);
router.get('/admin/all', protect, admin, getAllProductsAdmin); 
router.get('/featured',featuredProduct);
router.get("/category/:categoryId",getProductsByCategory);
router.get('/:id',getProductsById);
// router.post('/',protect,admin,upload.single("image"),createProduct);
router.post('/',protect,admin,upload.fields([
  { name: "image", maxCount: 1 },
  { name: "additionalImages", maxCount: 6 }
]),createProduct);
// router.put('/:id',protect,admin,updateProduct);
router.put(
  '/:id',
  protect,
  admin,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "additionalImages", maxCount: 6 }
  ]),
  updateProduct
);
router.delete('/:id',protect,admin,deleteProduct);


export default router;