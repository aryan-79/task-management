import { STATUS } from "@/constants/enums";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxios from "./useAxios";
import { Task } from "@/types/api-response";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

interface TaskCreate {
  name: string;
  dueDate: string;
  description: string;
  status: keyof typeof STATUS;
}
export default function useCreateTask() {
  const axios = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, dueDate, description, status }: TaskCreate) => {
      const response = await axios.post<Task>("/api/task/create", {
        name,
        dueDate,
        description,
        status,
      });
      return response.data;
    },
    onSuccess: (_, variables) => {
      toast.success(`${variables.name} added to tasks list`);
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        console.error(error.response?.data.message);
        toast.error(error.response?.data.message);
      } else {
        toast.error("Failed to create task");
      }
    },
  });
}
