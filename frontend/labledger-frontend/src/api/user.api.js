import api from "./axios";

export const fetchUsers = async () => {
  const res = await api.get("/users");
  return res.data;
};

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

export const updateUserRole = async (userId, role) => {
  const res = await api.patch(`/users/${userId}/role`, { role });
  return res.data;
};

export const deleteUser = async (userId) => {
  const res = await api.delete(`/users/${userId}`);
  return res.data;
};

export const updateUserSubteam = async (userId, subteamId) => {
  const res = await api.patch(`/users/${userId}/subteam`, { subteamId });
  return res.data;
};
