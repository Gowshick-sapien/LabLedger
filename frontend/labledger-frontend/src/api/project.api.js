import api from "./axios";

export const fetchProjects = async () => {
  const res = await api.get("/projects");
  return res.data;
};

export const fetchProjectById = async (projectId) => {
  const res = await api.get(`/projects/${projectId}`);
  return res.data;
};
