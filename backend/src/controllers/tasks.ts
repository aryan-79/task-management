import { Prisma, Task, TaskStatus } from "@prisma/client";
import { TaskInput, taskSchema, UpdateTaskInput } from "../config/validation";
import prisma from "../config/prisma";
import { DatabaseError, NotFoundError, ValidationError } from "../utils/errors";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

const createTask = async (userId: string, task: TaskInput): Promise<Task> => {
  const parseResult = taskSchema.safeParse(task);
  if (!parseResult.success) {
    throw new ValidationError(parseResult.error.issues[0].message);
  }
  const newTask = await prisma.task.create({
    data: {
      ...parseResult.data,
      user: {
        connect: { id: userId },
      },
    },
  });
  return newTask;
};

const updateTask = async (
  taskId: number,
  updatedTask: UpdateTaskInput
): Promise<Task> => {
  const parseResult = taskSchema.partial().safeParse(updatedTask);
  if (!parseResult.success) {
    console.error("error validation for update: ", parseResult.error);
    throw new ValidationError(parseResult.error.issues[0].message);
  }
  try {
    const updated = await prisma.task.update({
      where: { id: taskId },
      data: parseResult.data,
    });
    return updated;
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2025")
        throw new NotFoundError(`Task with id ${taskId} doesn't not exist`);
      else throw new DatabaseError("Database Error");
    }
    throw error;
  }
};

const deleteTask = async (taskId: number): Promise<Task> => {
  try {
    const deletedTask = await prisma.task.delete({ where: { id: taskId } });
    return deletedTask;
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2025")
        throw new NotFoundError(`Task with id ${taskId} doesn't not exist`);
      else {
        throw new DatabaseError("Failed to update task");
      }
    }
    throw error;
  }
};

interface GetTaskListParams {
  userId: string;
  page?: number;
  pageSize?: number;
  status?: TaskStatus;
  sortBy?: "createdAt" | "dueDate";
  sortOrder?: "asc" | "desc";
}

const getTaskList = async ({
  userId,
  page = 1,
  pageSize = 10,
  status,
  sortBy = "createdAt",
  sortOrder = "desc",
}: GetTaskListParams): Promise<{
  tasks: Task[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}> => {
  const safePage = Math.max(1, page);
  const safePageSize = Math.min(Math.max(1, pageSize), 100);
  const skip = (safePage - 1) * safePageSize;
  try {
    const where: Prisma.TaskWhereInput = {
      user_id: userId,
      ...(status && { status }), // Optional status filter
    };
    const orderBy: Prisma.TaskOrderByWithRelationInput = {
      [sortBy]: sortOrder,
    };

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        orderBy,
        skip,
        take: safePageSize,
      }),
      prisma.task.count({ where }),
    ]);

    return {
      tasks,
      total,
      page: safePage,
      pageSize: safePage,
      totalPages: Math.ceil(total / safePageSize),
    };
  } catch (error) {
    throw new DatabaseError("Failed to retrieve task list");
  }
};

const getTaskById = async (taskId: number): Promise<Task> => {
  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task)
    throw new NotFoundError(`Task with id ${taskId} doesn't not exist`);
  return task;
};

const verifyTaskOwnership = async (
  taskId: number,
  userId: string
): Promise<Boolean> => {
  const existingTask = await getTaskById(taskId);
  if (!existingTask)
    throw new NotFoundError(`Task with id ${taskId} doesn't not exist`);

  return existingTask.user_id === userId;
};

export {
  createTask,
  updateTask,
  deleteTask,
  getTaskList,
  getTaskById,
  verifyTaskOwnership,
};
