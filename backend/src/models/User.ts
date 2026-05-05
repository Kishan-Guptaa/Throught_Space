import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  profileImage: { type: String, default: "" },
  bio: { type: String, default: "" },
  socialLinks: {
    twitter: { type: String, default: "" },
    github: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    instagram: { type: String, default: "" }
  },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Blog" }],
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createdAt: { type: Date, default: Date.now },
});

export const User = mongoose.models.User || mongoose.model("User", userSchema);
