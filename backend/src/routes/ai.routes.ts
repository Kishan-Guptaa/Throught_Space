import { Router } from "express";
import { summarizeBlog, explainText } from "../controllers/ai.controller";
import { protect } from "../middleware/auth.middleware";

const router = Router();

router.use(protect);

router.post("/summarize", summarizeBlog);
router.post("/explain", explainText);

export default router;
