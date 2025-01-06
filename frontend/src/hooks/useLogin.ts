import useAuth from "@/components/common/AuthProvider";
import { AuthSuccessResponse, LoginData } from "@/types/api-response";
import { axiosInstance } from "@/utils/axios";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const useLogin = () => {
  const { setAuthToken, setUser } = useAuth();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async ({
      email,
      password,
    }: LoginData): Promise<AuthSuccessResponse> => {
      const response = await axiosInstance.post<AuthSuccessResponse>(
        "/api/login",
        {
          email,
          password,
        }
      );
      return response.data;
    },
    onSuccess: async (data) => {
      console.log("success", data);
      Promise.all([setAuthToken(data.token), setUser(data.user)]).then(() => {
        toast(`Welcome ${data.user.username}`);
        navigate("/");
      });
    },
    onError: async (error) => {
      console.log(error);
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      } else {
        toast.error("Login Failed.");
      }
    },
  });
};
