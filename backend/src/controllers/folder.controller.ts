import { Request, Response } from "express";
import { Folder } from "../models/Folder";
import { Blog } from "../models/Blog";

export const createFolder = async (req: Request, res: Response) => {
  try {
    const { name, color } = req.body;
    const owner = (req as any).user.id;

    if (!name) {
      return res.status(400).json({ error: "Folder name is required" });
    }

    const newFolder = await Folder.create({
      name,
      owner,
      color: color || "bg-gray-100",
    });

    res.status(201).json({ folder: newFolder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getFolders = async (req: Request, res: Response) => {
  try {
    const owner = (req as any).user.id;
    const userFolders = await Folder.find({ owner }).lean();

    const foldersWithCounts = await Promise.all(
      userFolders.map(async (folder) => {
        const count = await Blog.countDocuments({ folder: folder._id });
        return { ...folder, count };
      })
    );

    res.json({ folders: foldersWithCounts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateFolder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, color } = req.body;
    const owner = (req as any).user.id;

    const updatedFolder = await Folder.findOneAndUpdate(
      { _id: id, owner },
      { name, color },
      { new: true }
    );

    if (!updatedFolder) {
      return res.status(404).json({ error: "Folder not found or unauthorized" });
    }

    res.json({ folder: updatedFolder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteFolder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const owner = (req as any).user.id;

    const deletedFolder = await Folder.findOneAndDelete({ _id: id, owner });

    if (!deletedFolder) {
      return res.status(404).json({ error: "Folder not found or unauthorized" });
    }

    res.json({ message: "Folder deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getFolderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const owner = (req as any).user.id;

    const folder = await Folder.findOne({ _id: id, owner });

    if (!folder) {
      return res.status(404).json({ error: "Folder not found or unauthorized" });
    }

    res.json({ folder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getFolderBlogs = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const owner = (req as any).user.id;

    // Verify folder ownership first
    const folder = await Folder.findOne({ _id: id, owner });
    if (!folder) {
      return res.status(404).json({ error: "Folder not found or unauthorized" });
    }

    const blogs = await Blog.find({ folder: id }).sort({ createdAt: -1 });

    res.json({ blogs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
