import api from "./axios";

export const fetchModulesByProject = async (projectId) => {
  const res = await api.get(`/projects/${projectId}/modules`);
  return res.data;
};
