import express, { NextFunction, Request, Response } from "express";
import {
  getCurrentUser,
  handleLogin,
  handleLogout,
  handleRegister,
  reassignAccessToken,
} from "../controllers/auth";
import { AuthError, ValidationError } from "../utils/errors";

const router = express.Router();

// Register new user
router.post("/register", async (req: Request, res: Response) => {
  const { username, email, password, confirmPassword } = req.body;
  try {
    const result = await handleRegister(
      username,
      email,
      password,
      confirmPassword
    );
    res.status(201).json({
      message: "User registered successfully",
      userId: result.id,
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      res.status(400).json({ message: error.message, error: error.name });
      return;
    }
    if (error instanceof AuthError) {
      res.status(403).json({ message: error.message, error: error.type });
      return;
    }
    console.error("Registration error:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: "InternalServerError" });
  }
});

// signin user
router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const { accessToken, refreshToken, user } = await handleLogin(
      email,
      password
    );
    res.cookie("REFRESH_TOKEN", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Only send over HTTPS in production
      sameSite: "strict", // Protect against CSRF
      maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days to match JWT expiry
    });
    res
      .status(200)
      .json({ message: "Login Successful", token: accessToken, user });
  } catch (error) {
    if (error instanceof AuthError) {
      res.status(401).json({ message: error.message, error: error.type });
      return;
    }

    if (error instanceof ValidationError) {
      res.status(400).json({ message: error.message, error: error.name });
      return;
    }
    console.error("Login error:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: "InternalServerError" });
    return;
  }
});

// Logout user
router.post("/logout", async (req: Request, res: Response) => {
  const { id } = req.body;
  if (!id) {
    res.status(400).json({ message: "User ID is required" });
  }

  try {
    await handleLogout(id);
    res.clearCookie("REFRESH_TOKEN", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: "InternalServerError" });
  }
});

// Refresh access token
router.post("/refresh", async (req: Request, res: Response) => {
  const refreshToken = req.cookies.REFRESH_TOKEN;
  if (!refreshToken) {
    res.status(401).json({ message: "Refresh token not found" });
  }

  try {
    const newToken = await reassignAccessToken(refreshToken);
    res
      .status(200)
      .json({ message: "Token refreshed successfully", token: newToken });
  } catch (error) {
    if (error instanceof AuthError) {
      res.status(401).json({ message: error.message, error: error.type });
      return;
    }
    console.error("Token refresh error:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: "InternalServerError" });
  }
});

// Get user profile
router.get("/me", async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.REFRESH_TOKEN;
    const user = await getCurrentUser(refreshToken);
    res.status(200).json({ user });
  } catch (error) {
    if (error instanceof AuthError) {
      res.status(401).json({ message: error.message, error: error.type });
      return;
    }
    res
      .status(500)
      .json({ message: "Internal Server Error", error: "InternalServerError" });
  }
});

export default router;
