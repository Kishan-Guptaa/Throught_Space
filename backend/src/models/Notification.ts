import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { 
    type: String, 
    enum: ["follow", "like", "bookmark"], 
    required: true 
  },
  blog: { type: mongoose.Schema.Types.ObjectId, ref: "Blog" },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export const Notification = mongoose.model("Notification", notificationSchema);
