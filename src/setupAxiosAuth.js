import API from "./api/api";
import { storage } from "./utils/storage";

// Call once at app bootstrap.
export function setupAxiosAuth() {
  API.interceptors.request.use((config) => {
    const token = storage.getToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
}

