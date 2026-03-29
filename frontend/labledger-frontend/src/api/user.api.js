import api from "./axios";

export const fetchPendingUsers = async () => {
  const res = await api.get("/users/pending");
  return res.data;
};

export const approveUser = async (userId, role) => {
  const res = await api.patch(`/users/${userId}/approve`, { role });
  return res.data;
};

export const rejectUser = async (userId) => {
  const res = await api.delete(`/users/${userId}/reject`);
  return res.data;
};
