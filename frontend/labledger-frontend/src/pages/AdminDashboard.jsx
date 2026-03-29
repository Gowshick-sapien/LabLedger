import { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { fetchPendingUsers, approveUser, rejectUser, fetchUsers, updateUserRole, deleteUser, updateUserSubteam } from "../api/user.api";
import { fetchSubteams, createSubteam, deleteSubteam } from "../api/subteam.api";
import PageContainer from "../components/layout/PageContainer";
import { Card, CardBody } from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const [pendingUsers, setPendingUsers] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [subteams, setSubteams] = useState([]);
  
  const [newSubteamName, setNewSubteamName] = useState("");
  const [newSubteamDesc, setNewSubteamDesc] = useState("");
  
  const [apiError, setApiError] = useState("");
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (user && user.role === "admin") {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    setDataLoading(true);
    try {
      const [pendingData, allUsersData, subteamsData] = await Promise.all([
        fetchPendingUsers(),
        fetchUsers(),
        fetchSubteams()
      ]);
      setPendingUsers(pendingData);
      setActiveUsers(allUsersData.filter(u => u.status === 'approved' || u.status !== 'pending'));
      setSubteams(subteamsData);
    } catch (err) {
      setApiError("Failed to fetch dashboard data.");
    } finally {
      setDataLoading(false);
    }
  };

  const handleApprove = async (userId, role) => {
    try {
      await approveUser(userId, role);
      loadData(); 
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
      if (newRole === 'viewer') {
        setActiveUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole, subteam_id: null } : u));
      } else {
        setActiveUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
      }
      await updateUserRole(userId, newRole);
      loadData();
    } catch (err) {
      setApiError("Failed to update user role");
    }
  };

  const handleActiveSubteamChange = async (userId, newSubteamId) => {
    try {
      const parsedId = newSubteamId ? parseInt(newSubteamId) : null;
      await updateUserSubteam(userId, parsedId);
      loadData();
    } catch (err) {
      setApiError("Failed to update user subteam");
    }
  };

  const handleDeleteActiveUser = async (userId) => {
    if (!window.confirm("Are you sure you want to completely delete this active user? This may fail if they own attached resources.")) return;
    try {
      await deleteUser(userId);
      setActiveUsers(prev => prev.filter(u => u.id !== userId));
      loadData();
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setApiError(err.response.data.message);
      } else {
        setApiError("Failed to delete user");
      }
    }
  };

  const handleCreateSubteam = async (e) => {
    e.preventDefault();
    if (!newSubteamName) return;
    try {
      await createSubteam({ name: newSubteamName, description: newSubteamDesc });
      setNewSubteamName("");
      setNewSubteamDesc("");
      loadData();
    } catch (err) {
      setApiError("Failed to create subteam");
    }
  };

  const handleDeleteSubteam = async (subteamId, subteamName) => {
    const reason = window.prompt(`CRITICAL: You are about to delete subteam '${subteamName}'.\nPlease provide a mandatory reason for this deletion:`);
    if (reason === null) return; 
    if (reason.trim() === "") {
      setApiError("A valid reason must be provided to delete a subteam.");
      return;
    }

    try {
      await deleteSubteam(subteamId, reason);
      loadData();
    } catch (err) {
      if (err.response?.data?.message) {
        setApiError(err.response.data.message);
      } else {
        setApiError("Failed to delete subteam.");
      }
    }
  };

  if (loading) return <PageContainer><div className="text-gh-text-muted">Loading...</div></PageContainer>;
  
  if (!user || user.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <PageContainer>
      <div className="mb-6 pb-4 border-b border-gh-border">
        <h1 className="text-2xl font-semibold text-gh-text">Admin Dashboard</h1>
        <p className="text-gh-text-muted mt-1">Manage user registrations, subteams, and system settings.</p>
      </div>

      {apiError && <p className="text-gh-danger mb-4">{apiError}</p>}

      {/* SUBTEAMS SECTION */}
      <h2 className="text-lg font-medium text-gh-text mb-4">Subteams Configuration</h2>
      <Card className="mb-8 p-4">
        <form onSubmit={handleCreateSubteam} className="mb-6 flex gap-3 items-end">
          <Input 
            label="New Subteam Name"
            placeholder="e.g. Avionics"
            value={newSubteamName}
            onChange={(e) => setNewSubteamName(e.target.value)}
          />
          <Input 
            label="Description"
            placeholder="Flight electronics"
            value={newSubteamDesc}
            onChange={(e) => setNewSubteamDesc(e.target.value)}
          />
          <Button type="submit" variant="primary" className="mb-1">Create Subteam</Button>
        </form>

        {dataLoading ? (
          <p className="text-sm text-gh-text-muted">Loading subteams...</p>
        ) : subteams.length === 0 ? (
          <p className="text-sm text-gh-text-muted">No subteams currently exist in the system.</p>
        ) : (
          <div className="space-y-4">
            {subteams.map(st => (
              <div key={st.id} className="border border-gh-border rounded-md p-4 bg-gh-bg-secondary">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="font-semibold text-gh-text text-lg">{st.name}</h3>
                    <p className="text-sm text-gh-text-muted mb-3">{st.description}</p>
                  </div>
                  <Button variant="danger" className="text-xs" onClick={() => handleDeleteSubteam(st.id, st.name)}>
                    Delete Subteam
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Projects Column */}
                  <div>
                    <h4 className="text-xs uppercase font-semibold text-gh-text-muted mb-2 tracking-wider">Assigned Projects</h4>
                    {st.projects.length === 0 ? (
                      <span className="text-xs text-gh-text-muted">None</span>
                    ) : (
                      <ul className="text-sm space-y-1">
                        {st.projects.map(p => (
                          <li key={p.id}>
                            <Link to={`/projects/${p.id}`} className="text-gh-blue hover:underline font-medium">
                              {p.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  {/* Members Column */}
                  <div>
                    <h4 className="text-xs uppercase font-semibold text-gh-text-muted mb-2 tracking-wider">Assigned Members</h4>
                     {st.members.length === 0 ? (
                      <span className="text-xs text-gh-text-muted">None</span>
                    ) : (
                      <ul className="text-sm space-y-1 text-gh-text">
                        {st.members.map(m => (
                          <li key={m.id} className="flex justify-between items-center group">
                            <span>{m.name}</span>
                            <span className="text-xs text-gh-text-muted opacity-70 border border-gh-border rounded px-1">{m.role}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>


      {/* PENDING USERS SECTION */}
      <h2 className="text-lg font-medium text-gh-text mb-4 mt-8 pt-6 border-t border-gh-border">Pending Approvals</h2>
      {dataLoading ? (
        <p className="text-gh-text-muted">Loading pending users...</p>
      ) : pendingUsers.length === 0 ? (
        <div className="p-8 text-center text-gh-text-muted border border-gh-border rounded-md border-dashed">
          No users pending approval.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 mb-8">
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
                  <Button variant="primary" onClick={() => handleApprove(pUser.id, "contributor")} className="text-xs">
                    Approve as Contributor
                  </Button>
                  <Button variant="outline" onClick={() => handleApprove(pUser.id, "viewer")} className="text-xs">
                    Approve as Viewer
                  </Button>
                  <Button variant="danger" onClick={() => handleReject(pUser.id)} className="text-xs">
                    Reject
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      {/* ACTIVE USERS SECTION */}
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

                <div className="flex flex-wrap items-center gap-3">
                  <div className="text-sm font-medium">
                    <label className="text-xs text-gh-text-muted mr-2 block mb-1">System Role</label>
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
                  
                  <div className="text-sm font-medium mr-2">
                    <label className="text-xs text-gh-text-muted mr-2 block mb-1">Subteam Assigned</label>
                    <select
                      className="bg-gh-bg border border-gh-border text-gh-text rounded px-2 py-1 text-sm outline-none w-36 focus:border-gh-blue"
                      value={aUser.subteam_id || ""}
                      onChange={(e) => handleActiveSubteamChange(aUser.id, e.target.value)}
                      disabled={aUser.id === user.userId || aUser.role === 'viewer'}
                      title={aUser.role === 'viewer' ? "Viewers cannot be assigned to subteams" : ""}
                    >
                      <option value="">[ Unassigned ]</option>
                      {subteams.map(st => (
                        <option key={st.id} value={st.id}>{st.name}</option>
                      ))}
                    </select>
                  </div>

                  <Button
                    variant="danger"
                    onClick={() => handleDeleteActiveUser(aUser.id)}
                    className="text-xs self-end mb-0.5"
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
