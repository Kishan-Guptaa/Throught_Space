import mongoose from "mongoose";

const folderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  color: { type: String, default: "bg-gray-100" },
  createdAt: { type: Date, default: Date.now },
});

export const Folder = mongoose.models.Folder || mongoose.model("Folder", folderSchema);
