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

export const addExperimentLog = async (experimentId, payload) => {
  const res = await api.post(
    `/experiments/${experimentId}/logs`,
    payload
  );
  return res.data;
};
export const uploadLogAttachment = async (logId, file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await api.post(
    `/experiment-logs/${logId}/attachment`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data;
};
