import express, { Request, Response } from "express";
import { TaskInput, UpdateTaskInput } from "../config/validation";
import {
  createTask,
  deleteTask,
  getTaskById,
  getTaskList,
  updateTask,
  verifyTaskOwnership,
} from "../controllers/tasks";
import { DatabaseError, NotFoundError, ValidationError } from "../utils/errors";
import { AutheticatedRequest } from "../middleware/authMiddleware";
import { TaskStatus } from "@prisma/client";

const router = express.Router();

// create new task
router.post("/create", async (req: AutheticatedRequest, res: Response) => {
  const body = req.body as TaskInput;
  const user = req.user;
  if (!user) {
    res.status(401).json({ message: "Unauthorized" });
  } else {
    try {
      const task = await createTask(user.id, body);
      res.status(201).json({ message: "Task created successfully", task });
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).json({ message: error.message, error: error.name });
      } else {
        console.error("Error creating task: ", error);
        res.status(500).json({
          message: "Internal Server Error",
          error: "InternalServerError",
        });
      }
    }
  }
});

//update task
router.put(
  "/update/:taskId",
  async (req: AutheticatedRequest, res: Response) => {
    const user = req.user;
    if (!user) {
      res.status(401).json({ message: "Unauthorized" });
    }
    // parseInt(string, base10)
    const taskId = parseInt(req.params.taskId, 10);
    const updatedTask = req.body as UpdateTaskInput;

    try {
      const isOwner = await verifyTaskOwnership(taskId, user!.id);
      if (!isOwner) {
        res.status(403).json({ message: "Forbidden: Cannot update this task" });
      }
      const updated = await updateTask(taskId, updatedTask);
      res.status(200).json({ message: "Task updated", updatedTask: updated });
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).json({ message: "Task not found", error: error.name });
      } else if (error instanceof DatabaseError) {
        res.status(500).json({ message: "Database Error", error: error.name });
      } else {
        console.error("Error updating task: ", error);
        res.status(500).json({
          message: "Internal Server Error",
          error: "InternalServerError",
        });
      }
    }
  }
);

// delete task
router.delete(
  "/delete/:taskId",
  async (req: AutheticatedRequest, res: Response) => {
    const user = req.user;
    if (!user) {
      res.status(401).json({ message: "Unauthorized" });
    }
    const taskId = parseInt(req.params.taskId, 10);
    try {
      const isOwner = await verifyTaskOwnership(taskId, user!.id);
      if (!isOwner) {
        res.status(403).json({ message: "Forbidden: Cannot update this task" });
      }
      const deletedTask = await deleteTask(taskId);
      res
        .status(200)
        .json({ message: "Task deleted successfully", deletedTask });
    } catch (error) {
      if (error instanceof NotFoundError) {
        res.status(404).json({ message: "Task not found", error: error.name });
      } else if (error instanceof DatabaseError) {
        res
          .status(500)
          .json({ message: "Failed to delete task", error: error.name });
      } else {
        res.status(500).json({
          message: "Internal Server Error",
          error: "InternalServerError",
        });
      }
    }
  }
);

router.get("/", async (req: AutheticatedRequest, res: Response) => {
  const user = req.user;
  if (!user) {
    res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const page = req.query.page
      ? parseInt(req.query.page as string, 10)
      : undefined;
    const pageSize = req.query.pageSize
      ? parseInt(req.query.pageSize as string, 10)
      : undefined;
    const status = req.query.status as TaskStatus | undefined;
    const sortBy = req.query.sortBy as "createdAt" | "dueDate" | undefined;
    const sortOrder = req.query.sortOrder as "asc" | "desc" | undefined;
    const tasks = await getTaskList({
      userId: user!.id,
      page,
      pageSize,
      status,
      sortBy,
      sortOrder,
    });
    res.status(200).json(tasks);
  } catch (error) {
    if (error instanceof DatabaseError) {
      res.status(500).json({ message: "Database Error", error: error.name });
    } else {
      res.status(500).json({
        message: "Internal Server Error",
        error: "InternalServerError",
      });
    }
  }
});

router.get("/:taskId", async (req: AutheticatedRequest, res: Response) => {
  const user = req.user;
  if (!user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  try {
    const taskId = parseInt(req.params.taskId, 10);
    const isOwner = await verifyTaskOwnership(taskId, user!.id);
    if (!isOwner) {
      res.status(403).json({ message: "Forbidden: Could not get the task" });
      return;
    }

    const task = await getTaskById(taskId);
    res.status(200).json({ task });
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).json({ message: "Task not found", error: error.name });
    } else {
      res.status(500).json({
        message: "Internal Server Error",
        error: "InternalServerError",
      });
    }
  }
});

export default router;
