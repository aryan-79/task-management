import express, { NextFunction, Request, Response } from "express";
import {
  getCurrentUser,
  handleLogin,
  handleLogout,
  handleRegister,
  reassignAccessToken,
} from "../controllers/auth";
import { AuthError, ValidationError } from "../utils/errors";
import { asyncHandler } from "../utils/asyncHandler";

const router = express.Router();

// Register new user
router.post(
  "/register",
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, email, password, confirmPassword } = req.body;
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
        return res
          .status(400)
          .json({ message: error.message, error: error.name });
      }
      // Pass other errors to error handler
      next(error);
    }
  })
);

// Login user
router.post(
  "/login",
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const { accessToken, refreshToken, user } = await handleLogin(
        email,
        password
      );
      res.cookie("REFRESH_TOKEN", refreshToken, {
        maxAge: 15 * 24 * 60 * 60 * 1000,
      });
      res
        .status(200)
        .json({ message: "Login Successful", token: accessToken, user });
    } catch (error) {
      // Manually pass to error handler
      next(error);
    }
  })
);

// Logout user
router.post(
  "/logout",
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }
    await handleLogout(id);
    res.clearCookie("REFRESH_TOKEN", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    res.status(200).json({ message: "Logged out successfully" });
  })
);

// Refresh access token
router.get(
  "/refresh",
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log({ cookies: JSON.stringify(req.cookies) });
      // req.cookies.toString();
      const refreshToken = req.cookies.REFRESH_TOKEN;
      if (!refreshToken) {
        return res.status(401).json({ message: "Refresh token not found" });
      }

      const { token, user } = await reassignAccessToken(refreshToken);
      res.status(200).json({
        message: "Token refreshed successfully",
        token,
        user,
      });
    } catch (error) {
      // Manually pass to error handler
      next(error);
    }
  })
);

// Get user profile
router.get(
  "/me",
  asyncHandler(async (req: Request, res: Response) => {
    const refreshToken = req.cookies.REFRESH_TOKEN;
    const user = await getCurrentUser(refreshToken);
    res.status(200).json({ user });
  })
);

export default router;
