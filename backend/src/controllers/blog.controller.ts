import { Request, Response } from "express";
import { Blog } from "../models/Blog";
import { User } from "../models/User";


export const createBlog = async (req: Request, res: Response) => {
  try {
    const { title, content, coverImage, tags, folder, isPublished } = req.body;
    const author = (req as any).user.id;

    // Calculate read time
    const wordsPerMinute = 200;
    const words = (content || "").split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    const readTime = `${minutes} min read`;

    const newBlog = await Blog.create({
      title,
      content,
      coverImage,
      tags,
      folder,
      author,
      readTime,
      isPublished: isPublished || false,
    });

    res.status(201).json({ blog: newBlog });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getBlogs = async (req: Request, res: Response) => {
  try {
    const { sort, search, author } = req.query;

    let filter: any = { isPublished: true };
    if (author) {
      filter.author = author;
    }
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } }
      ];
    }

    let query = Blog.find(filter).populate("author", "name profileImage");

    if (sort === "popular") {
      query = query.sort({ likesCount: -1 }).limit(10);
    } else if (sort === "views") {
      query = query.sort({ views: -1 });
    } else {
      query = query.sort({ createdAt: -1 });
    }

    const results = await query;
    res.json({ blogs: results });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

import jwt from "jsonwebtoken";

export const getBlogById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if user is the author (optional auth)
    let currentUserId = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer")) {
      try {
        const token = authHeader.split(" ")[1];
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
        currentUserId = decoded.id;
      } catch (e) {
        // Ignore invalid token for public view
      }
    }

    const blog = await Blog.findById(id).populate("author", "name username profileImage bio");

    if (!blog) return res.status(404).json({ error: "Blog not found" });

    // Only increment if viewer is NOT the author and view param is true
    if (req.query.view === 'true' && (!currentUserId || blog.author._id.toString() !== currentUserId.toString())) {
      blog.views = (blog.views || 0) + 1;
      await blog.save();
    }




    res.json({ blog });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const updateBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const author = (req as any).user.id;
    const updateData = req.body;
    const { content } = updateData;
    if (content) {
      const wordsPerMinute = 200;
      const words = content.split(/\s+/).length;
      const minutes = Math.ceil(words / wordsPerMinute);
      updateData.readTime = `${minutes} min read`;
    }

    const updatedBlog = await Blog.findOneAndUpdate(
      { _id: id, author },
      updateData,
      { new: true }
    );

    if (!updatedBlog) return res.status(404).json({ error: "Unauthorized or not found" });

    res.json({ blog: updatedBlog });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const author = (req as any).user.id;

    const deleted = await Blog.findOneAndDelete({ _id: id, author });

    if (!deleted) return res.status(404).json({ error: "Unauthorized or not found" });

    res.json({ message: "Blog deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getBookmarkedBlogs = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const user = await User.findById(userId).populate({
      path: 'bookmarks',
      populate: { path: 'author', select: 'name profileImage bio' }
    });
    
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ blogs: user.bookmarks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const toggleBookmark = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const isBookmarked = user.bookmarks.includes(id as any);

    if (isBookmarked) {
      user.bookmarks = user.bookmarks.filter((bId: any) => bId.toString() !== id);
      await Blog.findByIdAndUpdate(id, { $inc: { bookmarksCount: -1 } });
    } else {
      user.bookmarks.push(id as any);
      await Blog.findByIdAndUpdate(id, { $inc: { bookmarksCount: 1 } });
    }

    await user.save();

    res.json({ message: isBookmarked ? "Bookmark removed" : "Bookmark added", isBookmarked: !isBookmarked });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
