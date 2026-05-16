import API from "./api";

export const tasksApi = {
  list: () => API.get("/tasks"),
  create: (payload) => API.post("/tasks", payload),
  update: (taskId, payload) => API.put(`/tasks/${taskId}`, payload),
  updateStatus: (taskId, payload) => API.patch(`/tasks/${taskId}/status`, payload),
  remove: (taskId) => API.delete(`/tasks/${taskId}`)
};

