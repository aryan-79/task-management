import { Task } from "@/types/api-response";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAxios from "./useAxios";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

type TaskUpdate = Partial<Omit<Task, "id">> & { id: number };

export default function useUpdateTask() {
  const axios = useAxios();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      name,
      description,
      dueDate,
      status,
    }: TaskUpdate) => {
      const response = await axios.put(`/api/task/update/${id}`, {
        name,
        description,
        dueDate,
        status,
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success("Task updated!!");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        console.error(error.response?.data.message);
        toast.error(error.response?.data.message || "Failed to update task");
      } else {
        toast.error("Failed to update task");
      }
    },
  });
}
