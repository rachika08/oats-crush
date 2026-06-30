import express from "express";
import {upload} from '../midleware/upload.js'
import { protect } from "../midleware/protect.js";
import {admin} from "../midleware/adminOnly.js";
import {
  createBlog,
  getBlogs,
  getSingleBlog,
  updateBlog,
  deleteBlog,
  addComment,
  getComments,
} from "../controllers/blogController.js";

const router = express.Router();


// Public Routes
router.get("/", getBlogs);
router.get("/:id", getSingleBlog);
router.get("/:id/comments", getComments);


// Logged-in users can comment
router.post("/:id/comments", protect, addComment);


// Admin only Routes
router.post(
  "/",
  protect,
  admin,
  upload.single("image"),
  createBlog
);

router.put(
  "/:id",
  protect,
  admin,
  upload.single("image"),
  updateBlog
);

router.delete(
  "/:id",
  protect,
  admin,
  deleteBlog
);

export default router;