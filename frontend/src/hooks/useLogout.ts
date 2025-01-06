import useAuth from "@/components/common/AuthProvider";
import { axiosInstance } from "@/utils/axios";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function useLogout() {
  const { user, setUser, clearAuthToken } = useAuth();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.post<{ message: string }>(
        "/api/logout",
        { id: user?.id }
      );
      return response.data;
    },
    onSuccess: (data) => {
      setUser(null);
      clearAuthToken();
      toast.success(data.message);
      navigate("/login");
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      } else {
        toast.error("Failed to Logout");
      }
    },
  });
}
