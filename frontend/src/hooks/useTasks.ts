import { useQuery } from "@tanstack/react-query";
import useAxios from "./useAxios";
import { TasksResponse } from "@/types/api-response";

export default function useTasks() {
  const axios = useAxios();
  return useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const response = await axios.get<TasksResponse>("/api/task");
      return response.data;
    },
    refetchOnMount: true,
  });
}
