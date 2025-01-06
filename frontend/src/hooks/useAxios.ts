import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import useAuth from "@/components/common/AuthProvider";
import { useLayoutEffect } from "react";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

export default function useAxios() {
  const { authToken, setAuthToken, setUser } = useAuth();
  const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    withCredentials: true,
    headers: {
      Authorization: authToken ? `Bearer ${authToken}` : "",
    },
  });

  useLayoutEffect(() => {
    const requestInterceptor = axiosInstance.interceptors.request.use(
      (config: CustomAxiosRequestConfig) => {
        console.log(config._retry);
        config.headers.Authorization =
          !config._retry && authToken
            ? `Bearer ${authToken}`
            : config.headers.Authorization;
        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );

    const responseInterceptor = axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: AxiosError) => {
        console.log("resposne interceptor");
        const originalRequest = error.config as CustomAxiosRequestConfig;
        originalRequest._retry = true;
        if (error.response?.status === 401 || error.response?.status === 403) {
          try {
            const refreshInstance = axios.create({
              baseURL: import.meta.env.VITE_BASE_URL,
              withCredentials: true,
            });
            const newToken = (
              await refreshInstance.get<{ message: string; token: string }>(
                "/api/refresh"
              )
            ).data.token;
            console.log("new token after response interception", newToken);
            setAuthToken(newToken);

            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return axiosInstance(originalRequest);
          } catch (refreshError) {
            setUser(null);
            setAuthToken(null);
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );
    () => {
      axiosInstance.interceptors.request.eject(requestInterceptor);
      axiosInstance.interceptors.response.eject(responseInterceptor);
    };
  }, [authToken]);

  return axiosInstance;
}
