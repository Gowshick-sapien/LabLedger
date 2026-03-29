import { useEffect, useState } from "react";
import { fetchProjects, createProject } from "../api/project.api";
import { fetchSubteams } from "../api/subteam.api";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, Link, Navigate } from "react-router-dom";
import PageContainer from "../components/layout/PageContainer";
import { Card, CardBody } from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const [projects, setProjects] = useState([]);
  const [subteams, setSubteams] = useState([]);
  const [error, setError] = useState("");
  
  const [showNew, setShowNew] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [selectedSubteamId, setSelectedSubteamId] = useState("");

  const navigate = useNavigate();

  const loadData = async () => {
    try {
      const [pData, sData] = await Promise.all([
        fetchProjects(),
        fetchSubteams()
      ]);
      setProjects(pData);
      setSubteams(sData);
      setError("");
    } catch {
      setError("Failed to load dashboard data");
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newName || !selectedSubteamId) {
      setError("Project Name and Subteam are required.");
      return;
    }
    
    try {
      await createProject({ 
        name: newName, 
        description: newDesc, 
        subteamId: parseInt(selectedSubteamId), 
        projectLeadId: user?.userId || user?.id 
      });
      setShowNew(false);
      setNewName("");
      setNewDesc("");
      setSelectedSubteamId("");
      loadData();
    } catch (err) {
      setError("Failed to create project");
    }
  };

  useEffect(() => {
    if (!user) return;
    loadData();
  }, [user]);

  if (loading) return <PageContainer><div className="text-gh-text-muted">Loading...</div></PageContainer>;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <PageContainer>
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gh-border">
        <h1 className="text-2xl font-semibold text-gh-text leading-tight">Projects</h1>
        {(user.role === 'contributor' || user.role === 'admin') && (
          <Button variant="primary" onClick={() => setShowNew(!showNew)}>
            {showNew ? "Cancel" : "New"}
          </Button>
        )}
      </div>

      {showNew && (
        <Card className="mb-6">
          <CardBody className="bg-gh-bg-secondary p-5">
            <h2 className="text-lg font-medium text-gh-text mb-4">Create a new Project</h2>
            <form onSubmit={handleCreateProject} className="flex flex-col gap-4 max-w-md">
              <Input
                label="Project Name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                required
              />
              <Input
                label="Description"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
              />
              <div>
                <label className="block text-sm font-medium text-gh-text mb-1.5">
                  Subteam Assignment <span className="text-gh-danger">*</span>
                </label>
                <select 
                  className="w-full bg-gh-bg border border-gh-border rounded-md px-3 py-1.5 text-sm text-gh-text focus:outline-none focus:border-gh-blue transition-colors"
                  value={selectedSubteamId}
                  onChange={(e) => setSelectedSubteamId(e.target.value)}
                  required
                >
                  <option value="" disabled>Select a subteam...</option>
                  {subteams.map(st => (
                     <option key={st.id} value={st.id}>{st.name}</option>
                  ))}
                </select>
                {subteams.length === 0 && (
                  <p className="text-xs text-gh-danger mt-1">
                    No subteams exist. An Admin must create them first.
                  </p>
                )}
              </div>
              <div className="flex gap-2 mt-2">
                <Button type="submit" variant="primary" disabled={subteams.length === 0}>Create Project</Button>
                <Button type="button" variant="secondary" onClick={() => setShowNew(false)}>Cancel</Button>
              </div>
            </form>
          </CardBody>
        </Card>
      )}

      {error && <p className="text-gh-danger mb-4">{error}</p>}

      {projects.length === 0 && (
        <div className="p-8 text-center text-gh-text-muted border border-gh-border rounded-md border-dashed">
          No projects available
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <Card key={project.id} className="hover:border-gh-border-active transition-colors">
            <CardBody className="flex flex-col h-full bg-gh-bg-secondary">
              <div className="flex items-start justify-between">
                <div>
                  <Link 
                    to={`/projects/${project.id}`}
                    className="text-gh-link text-base font-semibold hover:underline block"
                  >
                    {project.name}
                  </Link>
                  <div className="flex items-center gap-3 mt-3 text-xs text-gh-text-muted">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#d2a8ff] inline-block"></span>
                      SUBTEAM
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-3 h-3 text-gh-text-muted" fill="currentColor" viewBox="0 0 16 16"><path d="M10.561 8.073a6.005 6.005 0 0 1 3.432 5.142.75.75 0 1 1-1.498.07 4.5 4.5 0 0 0-8.99 0 .75.75 0 0 1-1.498-.07 6.004 6.004 0 0 1 3.431-5.142 3.999 3.999 0 1 1 5.123 0ZM10.5 5a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0Z"></path></svg>
                      {project.role || "Member"}
                    </span>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}
