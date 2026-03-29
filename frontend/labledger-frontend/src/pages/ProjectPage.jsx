import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Breadcrumb from "../components/layout/Breadcrumb";
import PageContainer from "../components/layout/PageContainer";
import { fetchProjectById, deleteProject } from "../api/project.api";
import { fetchModulesByProject, createModule } from "../api/module.api";
import { useAuth } from "../hooks/useAuth";
import { Card, CardBody } from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

export default function ProjectPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [project, setProject] = useState(null);
  const [modules, setModules] = useState([]);
  const [error, setError] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [newName, setNewName] = useState("");

  const loadModules = async () => {
    try {
      const moduleData = await fetchModulesByProject(id);
      setModules(moduleData);
    } catch {
      setError("Failed to load modules");
    }
  };

  const handleCreateModule = async (e) => {
    e.preventDefault();
    try {
      if (!newName) return;
      await createModule(id, { name: newName });
      setShowNew(false);
      setNewName("");
      loadModules();
    } catch (err) {
      setError("Failed to create module");
    }
  };

  const handleDeleteProject = async () => {
    if (!window.confirm("Are you sure you want to completely delete this project? This will permanently erase all modules and experiments within it. This action cannot be undone.")) return;
    try {
      await deleteProject(id);
      navigate("/dashboard");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to delete project");
      }
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const projectData = await fetchProjectById(id);
        setProject(projectData);

        const moduleData = await fetchModulesByProject(id);
        setModules(moduleData);
      } catch {
        setError("Failed to load project data");
      }
    };

    loadData();
  }, [id]);

  if (error) return <PageContainer><div className="text-gh-danger">{error}</div></PageContainer>;
  if (!project) return <PageContainer><div className="text-gh-text-muted">Loading...</div></PageContainer>;

  return (
    <PageContainer>
      <Breadcrumb
        items={[
          { label: "Projects", to: "/dashboard" },
          { label: project.name },
        ]}
      />

      <div className="mb-6 pb-4 border-b border-gh-border flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-semibold mb-2 text-gh-text">{project.name}</h1>
          <p className="text-gh-text-muted">{project.description}</p>
        </div>
        <div className="flex gap-2">
          {user?.role === 'admin' && (
            <Button variant="danger" onClick={handleDeleteProject}>
              Delete Project
            </Button>
          )}
          <Button variant="primary" onClick={() => setShowNew(!showNew)}>
            {showNew ? "Cancel" : "New Module"}
          </Button>
        </div>
      </div>

      {showNew && (
        <Card className="mb-6">
          <CardBody className="bg-gh-bg-secondary p-5">
            <h2 className="text-lg font-medium text-gh-text mb-4">Create a new Module</h2>
            <form onSubmit={handleCreateModule} className="flex flex-col gap-4 max-w-md">
              <Input
                label="Module Name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                required
              />
              <div className="flex gap-2 mt-2">
                <Button type="submit" variant="primary">Create Module</Button>
                <Button type="button" variant="secondary" onClick={() => setShowNew(false)}>Cancel</Button>
              </div>
            </form>
          </CardBody>
        </Card>
      )}

      <h2 className="text-lg font-medium mb-4 text-gh-text">Modules</h2>

      {modules.length === 0 && (
        <div className="p-8 text-center text-gh-text-muted border border-gh-border rounded-md border-dashed">
          No modules created yet
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {modules.map((module) => (
          <Card key={module.id} className="hover:border-gh-border-active transition-colors">
            <CardBody className="bg-gh-bg-secondary h-full flex items-center justify-between">
              <Link to={`/modules/${module.id}`} className="text-gh-link font-semibold hover:underline">
                {module.name}
              </Link>
              <Button variant="secondary" onClick={() => navigate(`/modules/${module.id}`)}>
                Open
              </Button>
            </CardBody>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}
