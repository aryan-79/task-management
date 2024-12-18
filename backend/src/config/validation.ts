import z from "zod";
import { TaskStatus } from "@prisma/client";

const registerSchema = z
  .object({
    email: z.string().email("Invalid Email"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]+/, "Must have at least one uppercase character")
      .regex(/[a-z]+/, "Must have at least one lowercase character")
      .regex(/\d+/, "Must have at least one number")
      .regex(/[\W_]+/, "Must have at least one special character")
      .regex(/^\S*$/, "Password cannot contain spaces"),
    confirm: z.string(),
  })
  .refine((data: any) => data.password === data.confirm, {
    message: "Passwords don't match",
    path: ["confirm"],
  });

const loginSchema = z.object({
  email: z.string().email("Invalid Email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const taskSchema = z.object({
  name: z
    .string()
    .min(1, "Task name is required")
    .max(40, "Task name must not exceed 40 characters"),
  description: z.string().min(1, "Task description is required"),
  dueDate: z.string().date("Invalid due date format. Expected YYYY-MM-DD"),
  status: z
    .enum([TaskStatus.IN_PROGRESS, TaskStatus.COMPLETED, TaskStatus.OVERDUE], {
      required_error: "Status is required",
      invalid_type_error: "Invalid status type",
    })
    .default(TaskStatus.IN_PROGRESS),
});

export { registerSchema, loginSchema, taskSchema };

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type TaskInput = z.infer<typeof taskSchema>;
export type UpdateTaskInput = Partial<TaskInput>;
