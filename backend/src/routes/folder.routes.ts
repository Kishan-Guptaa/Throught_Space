import { Router } from "express";
import {
  createFolder,
  getFolders,
  updateFolder,
  deleteFolder,
  getFolderById,
  getFolderBlogs
} from "../controllers/folder.controller";
import { protect } from "../middleware/auth.middleware";

const router = Router();

router.use(protect);

router.post("/", createFolder);
router.get("/", getFolders);
router.get("/:id", getFolderById);
router.get("/:id/blogs", getFolderBlogs);
router.put("/:id", updateFolder);
router.delete("/:id", deleteFolder);

export default router;
