import api from "./axios";

export const fetchProjects = async () => {
  const res = await api.get("/projects");
  return res.data;
};
