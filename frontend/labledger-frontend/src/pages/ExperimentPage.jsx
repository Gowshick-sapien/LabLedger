import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Breadcrumb from "../components/layout/Breadcrumb";
import PageContainer from "../components/layout/PageContainer";
import {
  fetchExperimentById,
  fetchLogsByExperiment,
} from "../api/experiment.api";

export default function ExperimentPage() {
  const { id } = useParams();

  const [experiment, setExperiment] = useState(null);
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const exp = await fetchExperimentById(id);
        setExperiment(exp);

        const logData = await fetchLogsByExperiment(id);
        setLogs(logData);
      } catch {
        setError("Failed to load experiment");
      }
    };

    loadData();
  }, [id]);

  if (error) return <PageContainer>{error}</PageContainer>;
  if (!experiment) return <PageContainer>Loading...</PageContainer>;

  return (
    <PageContainer>
      <Breadcrumb
        items={[
          { label: "Projects", to: "/dashboard" },
          { label: "Project", to: "#" },
          { label: "Module", to: "#" },
          { label: experiment.title },
        ]}
      />

      {/* Experiment Metadata */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold mb-2">{experiment.title}</h1>

        <p className="text-gray-700 mb-4">{experiment.objective}</p>

        <div className="text-sm text-gray-500 space-y-1">
          <p>Created by: {experiment.created_by_name || "—"}</p>
          <p>
            Created at:{" "}
            {new Date(experiment.created_at).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Logs Timeline */}
      <div>
        <h2 className="text-lg font-medium mb-4">Logs</h2>

        {logs.length === 0 && (
          <p className="text-gray-500">No logs added yet</p>
        )}

        <div className="space-y-4">
          {logs.map((log) => (
            <div
              key={log.id}
              className="bg-white p-4 rounded border shadow-sm"
            >
              <p className="text-sm text-gray-500 mb-2">
                {new Date(log.created_at).toLocaleString()}
              </p>

              <div className="space-y-2 text-sm">
                <p>
                  <strong>Procedure:</strong> {log.procedure}
                </p>
                <p>
                  <strong>Observations:</strong> {log.observations}
                </p>
                <p>
                  <strong>Outcome:</strong> {log.outcome}
                </p>
              </div>

              {log.parameters &&
                Object.keys(log.parameters).length > 0 && (
                  <div className="mt-3">
                    <h4 className="text-sm font-medium mb-1">Parameters</h4>
                    <table className="text-sm w-full border">
                      <tbody>
                        {Object.entries(log.parameters).map(
                          ([key, value]) => (
                            <tr key={key} className="border-t">
                              <td className="px-2 py-1 font-medium">{key}</td>
                              <td className="px-2 py-1">{value}</td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                )}

              {log.attachment_url && (
                <div className="mt-3">
                  <a
                    href={log.attachment_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-medium text-slate-900"
                  >
                    View Evidence →
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </PageContainer>
  );
}
