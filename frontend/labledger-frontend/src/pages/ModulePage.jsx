import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Breadcrumb from "../components/layout/Breadcrumb";
import PageContainer from "../components/layout/PageContainer";
import { fetchExperimentsByModule } from "../api/experiment.api";

export default function ModulePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [module, setModule] = useState(null);
  const [experiments, setExperiments] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadExperiments = async () => {
      try {
        // Backend may return module + experiments OR only experiments
        const data = await fetchExperimentsByModule(id);

        if (Array.isArray(data)) {
          setExperiments(data);
          setModule({ id, name: "Module" }); // fallback label
        } else {
          setModule(data.module);
          setExperiments(data.experiments || []);
        }
      } catch {
        setError("Failed to load experiments");
      }
    };

    loadExperiments();
  }, [id]);

  if (error) {
    return <PageContainer>{error}</PageContainer>;
  }

  if (!module) {
    return <PageContainer>Loading...</PageContainer>;
  }

  return (
    <PageContainer>
      <Breadcrumb
        items={[
          { label: "Projects", to: "/dashboard" },
          { label: "Project", to: "#" },
          { label: module.name },
        ]}
      />

      <h1 className="text-2xl font-semibold mb-6">{module.name}</h1>

      <h2 className="text-lg font-medium mb-3">Experiments</h2>

      {experiments.length === 0 && (
        <p className="text-gray-500">No experiments created yet</p>
      )}

      <div className="space-y-3">
        {experiments.map((exp) => (
          <div
            key={exp.id}
            className="bg-white p-4 rounded border shadow-sm flex justify-between items-center"
          >
            <div>
              <h3 className="font-medium">{exp.title}</h3>
              <p className="text-sm text-gray-600">{exp.objective}</p>
            </div>

            <button
              onClick={() => navigate(`/experiments/${exp.id}`)}
              className="text-sm font-medium text-slate-900"
            >
              Open →
            </button>
          </div>
        ))}
      </div>
    </PageContainer>
  );
}
