import { Request, Response } from "express";
import { User } from "../models/User";
import { Blog } from "../models/Blog";
import { Notification } from "../models/Notification";
import mongoose from "mongoose";

// Follow / Unfollow User
export const toggleFollow = async (req: Request, res: Response) => {
  try {
    const { followingId } = req.body;
    const followerId = (req as any).user.id;

    if (followerId === followingId) {
      return res.status(400).json({ error: "You cannot follow yourself" });
    }

    const currentUser = await User.findById(followerId);
    const targetUser = await User.findById(followingId);

    if (!currentUser || !targetUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const isFollowing = currentUser.following.some((id: any) => id.toString() === followingId);

    if (isFollowing) {
      currentUser.following = currentUser.following.filter((id: any) => id.toString() !== followingId);
      targetUser.followers = targetUser.followers.filter((id: any) => id.toString() !== followerId);
      await currentUser.save();
      await targetUser.save();
      return res.json({ message: "Unfollowed", isFollowing: false });
    } else {
      currentUser.following.push(followingId);
      targetUser.followers.push(followerId);
      await currentUser.save();
      await targetUser.save();

      // Create Notification
      await Notification.create({
        recipient: followingId,
        sender: followerId,
        type: "follow"
      });

      return res.json({ message: "Followed", isFollowing: true });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Toggle Like (Single like per user)
export const toggleLike = async (req: Request, res: Response) => {
  try {
    const { blogId } = req.body;
    const userId = (req as any).user.id;

    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ error: "Blog not found" });

    // Check if user already liked (handle both object and ID formats for safety)
    const existingLikeIndex = blog.likes.findIndex((l: any) => {
      const id = (l && l.user) ? l.user.toString() : (l ? l.toString() : null);
      return id === userId;
    });

    let isLiked = false;

    if (existingLikeIndex > -1) {
      // Unlike
      blog.likes.splice(existingLikeIndex, 1);
      blog.likesCount = Math.max(0, (blog.likesCount || 0) - 1);
      isLiked = false;
    } else {
      // Like
      blog.likes.push({ user: userId, count: 1 });
      blog.likesCount = (blog.likesCount || 0) + 1;
      isLiked = true;

      // Create Notification (only for new likes)
      if (blog.author.toString() !== userId) {
        await Notification.create({
          recipient: blog.author,
          sender: userId,
          type: "like",
          blog: blogId
        });
      }
    }

    await blog.save();

    res.json({ 
      message: isLiked ? "Liked" : "Unliked", 
      isLiked,
      totalLikes: blog.likesCount 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};


// Bookmark / Unbookmark Blog
export const toggleBookmark = async (req: Request, res: Response) => {
  try {
    const { blogId } = req.body;
    const userId = (req as any).user.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const isBookmarked = user.bookmarks.some((id: any) => id.toString() === blogId);

    if (isBookmarked) {
      user.bookmarks = user.bookmarks.filter((id: any) => id.toString() !== blogId);
      await Blog.findByIdAndUpdate(blogId, { $inc: { bookmarksCount: -1 } });
    } else {
      user.bookmarks.push(blogId);
      const blog = await Blog.findByIdAndUpdate(blogId, { $inc: { bookmarksCount: 1 } });
      
      // Create Notification
      if (blog && blog.author.toString() !== userId) {
        await Notification.create({
          recipient: blog.author,
          sender: userId,
          type: "bookmark",
          blog: blogId
        });
      }
    }

    await user.save();
    res.json({ message: isBookmarked ? "Bookmark removed" : "Bookmarked", isBookmarked: !isBookmarked });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get Notifications
export const getNotifications = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const notifications = await Notification.find({ recipient: userId })
      .sort({ createdAt: -1 })
      .populate("sender", "name username profileImage")
      .populate("blog", "title");

    res.json({ notifications });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Mark notifications as read
export const markAsRead = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    await Notification.updateMany({ recipient: userId, read: false }, { read: true });
    res.json({ message: "Notifications marked as read" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get Feed (Blogs from following)
export const getFeed = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const blogs = await Blog.find({ 
      author: { $in: user.following },
      isPublished: true 
    })
    .sort({ createdAt: -1 })
    .populate("author", "name username profileImage");

    res.json({ blogs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get Followers List
export const getFollowers = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate("followers", "name username profileImage bio");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ followers: user.followers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get Following List
export const getFollowing = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate("following", "name username profileImage bio");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ following: user.following });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

