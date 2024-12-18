import { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../utils/tokens";
import { AuthError } from "../utils/errors";

export interface AutheticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export const authMiddleware = (
  req: AutheticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  // console.log({ authHeader });
  const accessToken = authHeader && authHeader.split(" ")[1];

  if (!accessToken) {
    res.status(401).json({ message: "Unauthorized: Access token is missing" });
  } else
    try {
      const decoded = verifyAccessToken(accessToken);
      // console.log({ decoded });
      req.user = decoded;
      next();
    } catch (error) {
      if (error instanceof AuthError) {
        res.status(403).json({ message: error.message, error: error.type });
      }
      console.error("Token verification error:", error);
      res.status(500).json({
        message: "Internal Server Error",
        error: "InternalServerError",
      });
    }
};
