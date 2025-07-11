import axiosInstance from "axios";
import store from "../store";
import { config } from "../config/constants";
import { logout, updateToken } from "../store/authSlice";

const configAxios = axiosInstance.create({
  baseURL: config.API_BASE_URL,
  withCredentials: true,
});

configAxios.interceptors.request.use(
  (config) => {
    
    const token = store.getState().auth.token;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

configAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest.retry &&
      error.response.data.message === "Token expired, please login again."
    ) {
      originalRequest._retry = true;

      try {
        const res = await configAxios.post(
          "/api/refresh-token",
          {},
          { withCredentials: true }
        );

        const newToken = res.data.token;
        store.dispatch(updateToken(newToken));

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return await configAxios(originalRequest);

      } catch (refreshError) { 
        store.dispatch(logout());
        return Promise.reject(refreshError);        
      }
    }
    return Promise.reject(error);
  }
)



export default configAxios;
