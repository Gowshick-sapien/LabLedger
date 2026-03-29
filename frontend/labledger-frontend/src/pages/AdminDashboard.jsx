import { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { fetchPendingUsers, approveUser, rejectUser, fetchUsers, updateUserRole, deleteUser } from "../api/user.api";
import PageContainer from "../components/layout/PageContainer";
import { Card, CardBody } from "../components/ui/Card";
import Button from "../components/ui/Button";

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const [pendingUsers, setPendingUsers] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [apiError, setApiError] = useState("");
  const [dataLoading, setDataLoading] = useState(true);

  // Load users on mount
  useEffect(() => {
    if (user && user.role === "admin") {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    setDataLoading(true);
    try {
      const [pendingData, allUsersData] = await Promise.all([
        fetchPendingUsers(),
        fetchUsers()
      ]);
      setPendingUsers(pendingData);
      setActiveUsers(allUsersData.filter(u => u.status === 'approved' || u.status !== 'pending'));
    } catch (err) {
      setApiError("Failed to fetch user data.");
    } finally {
      setDataLoading(false);
    }
  };

  const handleApprove = async (userId, role) => {
    try {
      await approveUser(userId, role);
      loadData(); // Reload both lists
    } catch (err) {
      setApiError("Failed to approve user");
    }
  };

  const handleReject = async (userId) => {
    if (!window.confirm("Are you sure you want to reject and delete this user?")) return;
    try {
      await rejectUser(userId);
      setPendingUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (err) {
      setApiError("Failed to reject user");
    }
  };

  const handleActiveRoleChange = async (userId, newRole) => {
    try {
      await updateUserRole(userId, newRole);
      setActiveUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch (err) {
      setApiError("Failed to update user role");
    }
  };

  const handleDeleteActiveUser = async (userId) => {
    if (!window.confirm("Are you sure you want to completely delete this active user? This may fail if they own attached resources.")) return;
    try {
      await deleteUser(userId);
      setActiveUsers(prev => prev.filter(u => u.id !== userId));
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setApiError(err.response.data.message);
      } else {
        setApiError("Failed to delete user");
      }
    }
  };

  if (loading) return <PageContainer><div className="text-gh-text-muted">Loading...</div></PageContainer>;
  
  // Guard clause: Only admins can view this page
  if (!user || user.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <PageContainer>
      <div className="mb-6 pb-4 border-b border-gh-border">
        <h1 className="text-2xl font-semibold text-gh-text">Admin Dashboard</h1>
        <p className="text-gh-text-muted mt-1">Manage user registrations and system settings.</p>
      </div>

      <h2 className="text-lg font-medium text-gh-text mb-4">Pending Approvals</h2>

      {apiError && <p className="text-gh-danger mb-4">{apiError}</p>}

      {dataLoading ? (
        <p className="text-gh-text-muted">Loading pending users...</p>
      ) : pendingUsers.length === 0 ? (
        <div className="p-8 text-center text-gh-text-muted border border-gh-border rounded-md border-dashed">
          No users pending approval.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {pendingUsers.map((pUser) => (
            <Card key={pUser.id}>
              <CardBody className="bg-gh-bg-secondary p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-gh-text">{pUser.name}</h3>
                  <div className="text-sm text-gh-text-muted mt-1">
                    {pUser.email} &bull; Registered {" "}
                    {new Date(pUser.created_at).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="primary"
                    onClick={() => handleApprove(pUser.id, "contributor")}
                    className="text-xs"
                  >
                    Approve as Contributor
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleApprove(pUser.id, "viewer")}
                    className="text-xs"
                  >
                    Approve as Viewer
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleReject(pUser.id)}
                    className="text-xs"
                  >
                    Reject
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      <h2 className="text-lg font-medium text-gh-text mt-8 mb-4 border-t border-gh-border pt-6">Active System Users</h2>
      {dataLoading ? (
        <p className="text-gh-text-muted">Loading active users...</p>
      ) : activeUsers.length === 0 ? (
        <div className="p-8 text-center text-gh-text-muted border border-gh-border rounded-md border-dashed">
          No active users found.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {activeUsers.map((aUser) => (
            <Card key={aUser.id}>
              <CardBody className="bg-gh-bg-secondary p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-gh-text">
                    {aUser.name} 
                    {aUser.id === user.userId && <span className="text-xs text-blue-400 ml-2 border border-blue-400/30 px-2 py-0.5 rounded-full">You</span>}
                  </h3>
                  <div className="text-sm text-gh-text-muted mt-1">
                    {aUser.email}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-sm font-medium mr-2">
                    <select
                      className="bg-gh-bg border border-gh-border text-gh-text rounded px-2 py-1 text-sm outline-none w-32 focus:border-gh-blue"
                      value={aUser.role}
                      onChange={(e) => handleActiveRoleChange(aUser.id, e.target.value)}
                      disabled={aUser.id === user.userId}
                    >
                      <option value="admin">Admin</option>
                      <option value="contributor">Contributor</option>
                      <option value="viewer">Viewer</option>
                    </select>
                  </div>
                  
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteActiveUser(aUser.id)}
                    className="text-xs"
                    disabled={aUser.id === user.userId}
                  >
                    Delete
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
