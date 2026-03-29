import api from "./axios";

export const fetchProjects = async () => {
  const res = await api.get("/projects");
  return res.data;
};

export const fetchProjectById = async (projectId) => {
  const res = await api.get(`/projects/${projectId}`);
  return res.data;
};

export const createProject = async (payload) => {
  const res = await api.post("/projects", payload);
  return res.data;
};

export const deleteProject = async (projectId) => {
  const res = await api.delete(`/projects/${projectId}`);
  return res.data;
};
