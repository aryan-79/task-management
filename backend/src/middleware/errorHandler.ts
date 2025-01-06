import { NextFunction, Request, Response } from "express";

const errorHandler = (
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Error:", error);

  if (error instanceof Error) {
    res.status(500).json({
      message: error.message || "Internal Server Error",
      error: error.name || "InternalServerError",
    });
    return;
  }

  res.status(500).json({
    message: "Internal Server Error",
    error: "InternalServerError",
  });
};

export default errorHandler;
