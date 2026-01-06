import api from "./axios";

export const fetchExperimentsByModule = async (moduleId) => {
  const res = await api.get(`/modules/${moduleId}/experiments`);
  return res.data;
};

export const fetchExperimentById = async (experimentId) => {
  const res = await api.get(`/experiments/${experimentId}`);
  return res.data;
};

export const fetchLogsByExperiment = async (experimentId) => {
  const res = await api.get(`/experiments/${experimentId}/logs`);
  return res.data;
};
