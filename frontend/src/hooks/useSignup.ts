import { SignUpData } from "@/types/api-response";
import { axiosInstance } from "@/utils/axios";
import { useMutation } from "@tanstack/react-query";
import { useLogin } from "@/hooks/useLogin";
import { toast } from "react-toastify";

interface SignupSuccess {
  message: string;
  id: string;
}

export default function useSignup() {
  const { mutate } = useLogin();

  return useMutation({
    mutationFn: async (data: SignUpData): Promise<SignupSuccess> => {
      const response = await axiosInstance.post<SignupSuccess>(
        "/api/register",
        data
      );
      return response.data;
    },
    onSuccess: async (data, variables) => {
      toast.success(data.message);
      mutate({ email: variables.email, password: variables.password });
    },
  });
}
