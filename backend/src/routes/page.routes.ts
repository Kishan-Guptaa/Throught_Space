import express from "express";
import { getPageBySlug, updatePageContent } from "../controllers/page.controller";
import { protect } from "../middleware/auth.middleware";

const router = express.Router();

router.get("/:slug", getPageBySlug);
router.put("/:slug", protect, updatePageContent);

export default router;
