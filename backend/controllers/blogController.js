// controllers/blogController.js

import Blog from "../models/Blog.js";
import BlogComment from "../models/BlogComment.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";

// ======================
// CREATE BLOG (ADMIN)
// ======================



export const createBlog = async (req, res) => {
  try {
    const {
      title,
      shortDescription,
      content,
      author,
      category,
      tags,
    } = req.body;

    let coverImage = "";

    if (req.file) {
      const uploadedImage = await uploadToCloudinary(
        req.file.buffer
      );

      coverImage = uploadedImage.secure_url;
    }

    const blog = await Blog.create({
      title,
      shortDescription,
      content,
      author,
      category,
      tags: tags ? tags.split(",") : [],
      coverImage,
    });

    res.status(201).json({
      success: true,
      message: "Blog created successfully",
      blog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// ======================
// GET ALL BLOGS
// ======================

export const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: blogs.length,
      blogs,
    });
  } catch (error) {
    console.log("Get Blogs Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ======================
// GET SINGLE BLOG
// ======================

export const getSingleBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    res.status(200).json({
      success: true,
      blog,
    });
  } catch (error) {
    console.log("Get Single Blog Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ======================
// UPDATE BLOG (ADMIN)
// ======================

export const updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    const updatedData = {
      title: req.body.title || blog.title,
      shortDescription:
        req.body.shortDescription || blog.shortDescription,
      content: req.body.content || blog.content,
      author: req.body.author || blog.author,
      category: req.body.category || blog.category,
      tags: req.body.tags
        ? req.body.tags.split(",")
        : blog.tags,
    };

    // if (req.file) {
    //   updatedData.coverImage = req.file.path;
    // }
    if (req.file) {
        const uploadedImage = await uploadToCloudinary(
            req.file.buffer
        );

        updatedData.coverImage = uploadedImage.secure_url;
    }
    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      updatedData,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      blog: updatedBlog,
    });
  } catch (error) {
    console.log("Update Blog Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ======================
// DELETE BLOG (ADMIN)
// ======================

export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // delete associated comments
    await BlogComment.deleteMany({
      blog: req.params.id,
    });

    await blog.deleteOne();

    res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    console.log("Delete Blog Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ======================
// ADD COMMENT / REVIEW
// ======================

export const addComment = async (req, res) => {
  try {
    const { name, comment, rating } = req.body;

    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    if (!name || !comment || !rating) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields",
      });
    }

    const newComment = await BlogComment.create({
      blog: req.params.id,
      user: req.user?.id || null,
      name,
      comment,
      rating,
    });

    res.status(201).json({
      success: true,
      message: "Comment added successfully",
      comment: newComment,
    });
  } catch (error) {
    console.log("Add Comment Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ======================
// GET BLOG COMMENTS
// ======================

export const getComments = async (req, res) => {
  try {
    const comments = await BlogComment.find({
      blog: req.params.id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: comments.length,
      comments,
    });
  } catch (error) {
    console.log("Get Comments Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};