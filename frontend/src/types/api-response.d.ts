export interface AuthSuccessResponse {
  message: string;
  token: string;
  user: User;
}

export interface User {
  id: string;
  email: string;
  username: string;
}

export interface LoginData {
  email: string;
  password: string;
}
export interface SignUpData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}
export interface Task {
  id: number;
  name: string;
  description: string;
  dueDate: string;
  status: "IN_PROGRESS" | "COMPLETED" | "OVERDUE";
  user_id: string;
  createdAt: string;
  updatedAt: string;
}

export interface TasksResponse {
  tasks: Task[];
  total: number;
  page: number;
  pageSize: number;
  totalPagess: number;
}
