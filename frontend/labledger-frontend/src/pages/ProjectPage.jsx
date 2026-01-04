import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchProjectById } from "../api/project.api";
import Breadcrumb from "../components/layout/Breadcrumb";
import PageContainer from "../components/layout/PageContainer";

export default function ProjectPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProject = async () => {
      try {
        const data = await fetchProjectById(id);
        setProject(data);
      } catch {
        setError("Failed to load project");
      }
    };
    loadProject();
  }, [id]);

  if (error) {
    return <PageContainer>{error}</PageContainer>;
  }

  if (!project) {
    return <PageContainer>Loading...</PageContainer>;
  }

  return (
    <PageContainer>
      <Breadcrumb
        items={[
          { label: "Projects", to: "/dashboard" },
          { label: project.name },
        ]}
      />

      <h1 className="text-2xl font-semibold mb-2">{project.name}</h1>
      <p className="text-gray-600 mb-6">{project.description}</p>

      <h2 className="text-lg font-medium mb-3">Modules</h2>

      {project.modules?.length === 0 && (
        <p className="text-gray-500">No modules created yet</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {project.modules?.map((module) => (
          <div
            key={module.id}
            className="bg-white p-4 rounded border shadow-sm"
          >
            <h3 className="font-medium">{module.name}</h3>

            <button
              onClick={() => navigate(`/modules/${module.id}`)}
              className="mt-3 text-sm font-medium text-slate-900"
            >
              Open Module →
            </button>
          </div>
        ))}
      </div>
    </PageContainer>
  );
}
