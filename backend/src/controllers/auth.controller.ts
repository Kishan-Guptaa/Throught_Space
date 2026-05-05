import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/User";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, username } = req.body;

    if (!name || !email || !password || !username) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if user or username exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ error: "User or Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      username: username.toLowerCase(),
      password: hashedPassword,
    });

    const token = jwt.sign({ id: newUser._id.toString() }, JWT_SECRET, { expiresIn: "48h" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 48 * 60 * 60 * 1000,
    });

    res.status(201).json({ 
      message: "User registered successfully", 
      user: { 
        id: newUser._id.toString(), 
        name: newUser.name, 
        email: newUser.email,
        username: newUser.username,
        profileImage: newUser.profileImage,
        bio: newUser.bio,
        followersCount: 0,
        followingCount: 0
      } 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Missing credentials" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id.toString() }, JWT_SECRET, { expiresIn: "48h" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 48 * 60 * 60 * 1000, // 48 hours
    });

    res.json({
      message: "Login successful",
      user: { 
        id: user._id.toString(), 
        name: user.name, 
        email: user.email,
        username: user.username,
        profileImage: user.profileImage,
        bio: user.bio,
        followersCount: user.followers.length,
        followingCount: user.following.length
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
};

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ 
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        username: user.username,
        profileImage: user.profileImage,
        bio: user.bio,
        followersCount: user.followers.length,
        followingCount: user.following.length,
        createdAt: user.createdAt
      } 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

import crypto from "crypto";
import nodemailer from "nodemailer";

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { name, bio, profileImage, username, socialLinks } = req.body;

    // Check if username is already taken by another user
    if (username) {
      const existing = await User.findOne({ username: username.toLowerCase(), _id: { $ne: userId } });
      if (existing) return res.status(400).json({ error: "Username already taken" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, bio, profileImage, username: username?.toLowerCase(), socialLinks },
      { new: true }
    ).select("-password");


    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found with this email" });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour

    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/reset-password/${resetToken}`;

    // Configure your email service (Using explicit host/port for Gmail reliability)
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"ThoughtSpace" <${process.env.EMAIL_USER}>`,
      to: email, // use the email from req.body
      subject: "Password Reset Request",
      html: `
        <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: auto; padding: 40px; border: 1px solid #f0f0f0; border-radius: 24px; background-color: #ffffff; color: #111111;">
          <h2 style="font-size: 24px; font-weight: 900; margin-bottom: 16px; letter-spacing: -0.05em;">Reset Your Password</h2>
          <p style="font-size: 16px; line-height: 1.6; color: #666666;">You requested a password reset for your ThoughtSpace account. Click the button below to continue.</p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${resetUrl}" style="display: inline-block; padding: 16px 32px; background-color: #111111; color: #ffffff; text-decoration: none; border-radius: 12px; font-weight: 800; font-size: 16px;">Set New Password</a>
          </div>
          <p style="font-size: 14px; color: #999999; margin-top: 32px; border-top: 1px solid #f0f0f0; padding-top: 24px;">If you didn't request this, you can safely ignore this email. Link expires in 1 hour.</p>
        </div>
      `,
    };

    // Send the email
    try {
      await transporter.sendMail(mailOptions);
      console.log(`Success: Reset email sent to ${email}`);
      return res.json({ message: "Password reset link sent to your email" });
    } catch (emailError) {
      console.error("Nodemailer Error:", emailError);
      return res.status(500).json({ 
        error: "Failed to send email. Please check your backend .env credentials.",
        details: emailError instanceof Error ? emailError.message : "SMTP Error"
      });
    }
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired reset token" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ message: "Password updated successfully! You can now login." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const searchUsers = async (req: Request, res: Response) => {
  try {
    const { query } = req.query;
    if (!query) return res.json({ users: [] });

    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: "i" } },
        { name: { $regex: query, $options: "i" } }
      ]
    }).limit(10).select("name username profileImage bio");

    res.json({ users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUserByUsername = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username }).select("-password");

    if (!user) return res.status(404).json({ error: "User not found" });

    // Check if current user is following
    const currentUserId = (req as any).user?.id;
    const isFollowing = currentUserId 
      ? user.followers.some((f: any) => f.toString() === currentUserId) 
      : false;

    res.json({ 
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        profileImage: user.profileImage,
        bio: user.bio,
        socialLinks: user.socialLinks,
        followersCount: user.followers.length,
        followingCount: user.following.length,
        isFollowing
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getSuggestedUsers = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    
    // Get 10 random users excluding current user
    const users = await User.aggregate([
      { $match: { _id: { $ne: new mongoose.Types.ObjectId(userId) } } },
      { $sample: { size: 10 } },
      {
        $project: {
          name: 1,
          username: 1,
          profileImage: 1,
          bio: 1
        }
      }
    ]);

    res.json({ users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};



