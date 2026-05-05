import { Router } from "express";
import {
  createBlog,
  getBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  getBookmarkedBlogs,
  toggleBookmark
} from "../controllers/blog.controller";
import { protect } from "../middleware/auth.middleware";

const router = Router();

// Protected routes (must come before /:id)
router.get("/bookmarked", protect, getBookmarkedBlogs);
router.post("/:id/bookmark", protect, toggleBookmark);

// Public routes
router.get("/", getBlogs);
router.get("/:id", getBlogById);

// Protected routes
router.post("/", protect, createBlog);
router.put("/:id", protect, updateBlog);
router.delete("/:id", protect, deleteBlog);

export default router;
