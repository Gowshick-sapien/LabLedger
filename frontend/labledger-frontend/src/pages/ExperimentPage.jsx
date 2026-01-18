import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Breadcrumb from "../components/layout/Breadcrumb";
import PageContainer from "../components/layout/PageContainer";
import { useAuth } from "../hooks/useAuth";

import {
  fetchExperimentById,
  fetchLogsByExperiment,
  addExperimentLog,
  uploadLogAttachment,
} from "../api/experiment.api";

export default function ExperimentPage() {
  const { id } = useParams();
  const { user } = useAuth();

  const canWrite =
    user?.role === "lead" || user?.role === "contributor";

  const [experiment, setExperiment] = useState(null);
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState("");

  // add-log state
  const [procedure, setProcedure] = useState("");
  const [observations, setObservations] = useState("");
  const [outcome, setOutcome] = useState("");

  // file state per log
  const [selectedFiles, setSelectedFiles] = useState({});

  useEffect(() => {
    const loadData = async () => {
      try {
        setExperiment(await fetchExperimentById(id));
        setLogs(await fetchLogsByExperiment(id));
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

      {/* ===== Experiment Metadata ===== */}
      <div className="mb-8 bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight mb-1">
          {experiment.title}
        </h1>

        <p className="text-slate-600 mb-4">
          {experiment.objective}
        </p>

        <div className="text-sm text-slate-500">
          Created at{" "}
          {new Date(experiment.created_at).toLocaleString()}
        </div>
      </div>

      {/* ===== Add Log ===== */}
      {canWrite && (
        <div className="mb-8 bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">
            Append Log Entry
          </h2>

          <form
            onSubmit={async (e) => {
              e.preventDefault();

              await addExperimentLog(id, {
                procedure,
                observations,
                outcome,
              });

              setLogs(await fetchLogsByExperiment(id));
              setProcedure("");
              setObservations("");
              setOutcome("");
            }}
            className="space-y-4"
          >
            <textarea
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm
              focus:outline-none focus:ring-2 focus:ring-slate-400"
              placeholder="Procedure performed"
              value={procedure}
              onChange={(e) => setProcedure(e.target.value)}
              required
            />

            <textarea
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm
              focus:outline-none focus:ring-2 focus:ring-slate-400"
              placeholder="Observations"
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              required
            />

            <input
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm
              focus:outline-none focus:ring-2 focus:ring-slate-400"
              placeholder="Outcome"
              value={outcome}
              onChange={(e) => setOutcome(e.target.value)}
              required
            />

            <button
              className="bg-slate-900 hover:bg-slate-800 text-white
              text-sm font-medium px-4 py-2 rounded-md transition"
            >
              Append Log
            </button>
          </form>
        </div>
      )}

      {/* ===== Logs ===== */}
      <div className="space-y-4">
        {logs.map((log) => (
          <div
            key={log.id}
            className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm"
          >
            <p className="text-xs text-slate-400 mb-3">
              {new Date(log.created_at).toLocaleString()}
            </p>

            <div className="text-sm space-y-2">
              <p>
                <strong className="text-slate-700">Procedure:</strong>{" "}
                {log.procedure}
              </p>
              <p>
                <strong className="text-slate-700">Observations:</strong>{" "}
                {log.observations}
              </p>
              <p>
                <strong className="text-slate-700">Outcome:</strong>{" "}
                {log.outcome}
              </p>
            </div>

            {/* ===== Attachment ===== */}
            <div className="mt-4">
              {log.attachment_url ? (
                <a
                  href={log.attachment_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-medium text-indigo-600 hover:underline"
                >
                  View Evidence →
                </a>
              ) : (
                canWrite && (
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      onChange={(e) =>
                        setSelectedFiles({
                          ...selectedFiles,
                          [log.id]: e.target.files[0],
                        })
                      }
                      className="text-sm"
                    />
                    <button
                      onClick={async () => {
                        const file = selectedFiles[log.id];
                        if (!file) return;

                        await uploadLogAttachment(log.id, file);
                        setLogs(await fetchLogsByExperiment(id));
                      }}
                      className="text-xs font-medium text-slate-700 hover:text-slate-900"
                    >
                      Upload once
                    </button>
                  </div>
                )
              )}
            </div>
          </div>
        ))}
      </div>
    </PageContainer>
  );
}
