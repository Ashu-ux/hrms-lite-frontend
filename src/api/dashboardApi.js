import API from "./api";

export const dashboardApi = {
  stats: () => API.get("/dashboard/stats")
};

