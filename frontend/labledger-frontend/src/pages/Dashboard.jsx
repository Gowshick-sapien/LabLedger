import { useEffect, useState } from "react";
import { fetchProjects } from "../api/project.api";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const loadProjects = async () => {
      try {
        const data = await fetchProjects();
        setProjects(data);
      } catch {
        setError("Failed to load projects");
      }
    };

    loadProjects();
  }, [user]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <h1 className="text-2xl font-semibold mb-6">Projects</h1>

      {error && <p className="text-red-500">{error}</p>}

      {projects.length === 0 && (
        <p className="text-gray-500">No projects available</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-white rounded-lg shadow-sm p-4 border"
          >
            <h2 className="text-lg font-medium">{project.name}</h2>

            <p className="text-sm text-gray-600 mt-1">
              {project.project_type}
            </p>

            <p className="text-sm text-gray-500 mt-1">
              Role: {project.role}
            </p>

            <button
              onClick={() => navigate(`/projects/${project.id}`)}
              className="mt-4 text-sm text-slate-900 font-medium"
            >
              Open Project →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
