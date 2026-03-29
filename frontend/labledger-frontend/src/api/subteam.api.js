import api from "./axios";

export const fetchSubteams = async () => {
  const res = await api.get("/subteams");
  return res.data;
};

export const createSubteam = async (payload) => {
  const res = await api.post("/subteams", payload);
  return res.data;
};

export const deleteSubteam = async (id, reason) => {
  const res = await api.delete(`/subteams/${id}`, { data: { reason } });
  return res.data;
};
