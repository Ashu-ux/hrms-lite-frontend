import API from "./api";

export const authApi = {
  login: (payload) => API.post("/auth/login", payload),
  register: (payload) => API.post("/auth/register", payload),
  profile: () => API.get("/auth/profile")
};

