import { AuthSuccessResponse, User } from "@/types/api-response";
import { axiosInstance } from "@/utils/axios";
import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  authToken: string | null;
  setAuthToken: (value: string | null) => void;
  isAuthenticated: boolean;
  clearAuthToken: () => void;
  user: User | null;
  setUser: (value: User | null) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  authToken: null,
  setAuthToken: () => {},
  isAuthenticated: false,
  clearAuthToken: () => {},
  user: null,
  setUser: () => {},
  isLoading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const isAuthenticated = !!authToken;
  const clearAuthToken = () => setAuthToken(null);

  const { data, isPending, isSuccess, isError } = useQuery({
    queryKey: ["auth", "refressh"],
    queryFn: async () => {
      const response = await axiosInstance.get<AuthSuccessResponse>(
        "/api/refresh"
      );
      return response.data;
    },
    retry: false,
  });

  useEffect(() => {
    if (isSuccess && data) {
      setAuthToken(data.token);
      setUser(data.user);
    }
    if (isError) {
      clearAuthToken();
      setUser(null);
    }
  }, [isSuccess, isError, data]);

  return (
    <AuthContext.Provider
      value={{
        authToken,
        setAuthToken,
        isAuthenticated,
        clearAuthToken,
        user,
        setUser,
        isLoading: isPending,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default function useAuth() {
  return useContext(AuthContext);
}
