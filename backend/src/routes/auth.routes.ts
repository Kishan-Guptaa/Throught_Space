import { Router } from "express";
import {
  register,
  login,
  logout,
  getCurrentUser,
  updateProfile,
  forgotPassword,
  resetPassword,
  searchUsers,
  getUserByUsername,
  getSuggestedUsers,
} from "../controllers/auth.controller";
import { protect } from "../middleware/auth.middleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", protect, getCurrentUser);
router.put("/profile", protect, updateProfile);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.get("/search", protect, searchUsers);
router.get("/profile/:username", protect, getUserByUsername);

router.get("/suggested", protect, getSuggestedUsers);

export default router;
