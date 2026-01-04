import api from "./axios";

export const fetchExperimentsByModule = async (moduleId) => {
  const res = await api.get(`/modules/${moduleId}/experiments`);
  return res.data;
};
