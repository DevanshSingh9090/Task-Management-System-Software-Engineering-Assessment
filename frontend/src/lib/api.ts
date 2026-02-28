import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true
});

let isRefreshing = false;
let queue: Array<{ resolve: (v?: any)=>void, reject: (e:any)=>void, config: any }> = [];

const processQueue = (error: any = null) => {
  queue.forEach(({ resolve, reject, config }) => {
    if (error) reject(error);
    else resolve(api(config));
  });
  queue = [];
};

api.interceptors.response.use(
  res => res,
  async error => {
    const original = error.config;
    if (!original) return Promise.reject(error);
    if (error.response?.status === 401 && !original._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          queue.push({ resolve, reject, config: original });
        });
      }
      original._retry = true;
      isRefreshing = true;
      try {
        await api.post("/auth/refresh");
        isRefreshing = false;
        processQueue(null);
        return api(original);
      } catch (e) {
        isRefreshing = false;
        processQueue(e);
        toast.error("Session expired. Please login again.");
        window.location.href = "/login";
        return Promise.reject(e);
      }
    }
    if (error.response?.data?.message) toast.error(error.response.data.message);
    else toast.error("Unknown error");
    return Promise.reject(error);
  }
);

export default api;
