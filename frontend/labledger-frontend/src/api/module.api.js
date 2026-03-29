import api from "./axios";

export const fetchModulesByProject = async (projectId) => {
  const res = await api.get(`/projects/${projectId}/modules`);
  return res.data;
};

export const createModule = async (projectId, payload) => {
  const res = await api.post(`/projects/${projectId}/modules`, payload);
  return res.data;
};
