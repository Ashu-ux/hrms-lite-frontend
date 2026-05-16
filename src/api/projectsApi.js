import API from "./api";

export const projectsApi = {
  list: () => API.get("/projects"),
  create: (payload) => API.post("/projects", payload),
  update: (projectId, payload) => API.put(`/projects/${projectId}`, payload),
  remove: (projectId) => API.delete(`/projects/${projectId}`),
  addMember: (projectId, payload) =>
    API.post(`/projects/${projectId}/members`, payload),
  removeMember: (projectId, userId) =>
    API.delete(`/projects/${projectId}/members/${userId}`)
};

