import mongoose from "mongoose";

const pageSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true }, // e.g., 'about', 'privacy'
  title: { type: String, required: true },
  content: { type: String, required: true },
  updatedAt: { type: Date, default: Date.now }
});

export const Page = mongoose.models.Page || mongoose.model("Page", pageSchema);
