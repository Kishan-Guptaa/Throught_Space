import { Router } from "express";
import {
  toggleLike,
  toggleFollow,
  toggleBookmark,
  getFeed,
  getFollowers,
  getFollowing,
  getNotifications,
  markAsRead,
} from "../controllers/social.controller";
import { protect } from "../middleware/auth.middleware";

const router = Router();

router.use(protect);

router.post("/like", toggleLike);
router.post("/follow", toggleFollow);
router.post("/bookmark", toggleBookmark);
router.get("/feed", getFeed);
router.get("/followers/:userId", getFollowers);
router.get("/following/:userId", getFollowing);
router.get("/notifications", getNotifications);
router.put("/notifications/read", markAsRead);

export default router;
