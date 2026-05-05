import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  coverImage: { type: String, default: "" },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  folder: { type: mongoose.Schema.Types.ObjectId, ref: "Folder" },
  tags: [{ type: String }],
  views: { type: Number, default: 0 },
  likes: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      count: { type: Number, default: 0 }
    }
  ],
  likesCount: { type: Number, default: 0 },
  bookmarksCount: { type: Number, default: 0 },
  isPublished: { type: Boolean, default: false },
  readTime: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Blog = mongoose.models.Blog || mongoose.model("Blog", blogSchema);
