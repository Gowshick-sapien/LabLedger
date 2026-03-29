import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Breadcrumb from "../components/layout/Breadcrumb";
import PageContainer from "../components/layout/PageContainer";
import { useAuth } from "../hooks/useAuth";
import { Card, CardHeader, CardBody } from "../components/ui/Card";
import Button from "../components/ui/Button";

import {
  fetchExperimentById,
  fetchLogsByExperiment,
  addExperimentLog,
  uploadLogAttachment,
} from "../api/experiment.api";

export default function ExperimentPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const canWrite = user?.role === "lead" || user?.role === "contributor";

  const [experiment, setExperiment] = useState(null);
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState("");

  const [procedure, setProcedure] = useState("");
  const [observations, setObservations] = useState("");
  const [outcome, setOutcome] = useState("");
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

  if (error) return <PageContainer><div className="text-gh-danger">{error}</div></PageContainer>;
  if (!experiment) return <PageContainer><div className="text-gh-text-muted">Loading...</div></PageContainer>;

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
      <div className="mb-6 border-b border-gh-border pb-6">
        <h1 className="text-2xl font-bold tracking-tight mb-2 text-gh-text">
          {experiment.title}
        </h1>
        <p className="text-gh-text-muted mb-3 max-w-3xl">
          {experiment.objective}
        </p>
        <div className="text-xs font-mono text-gh-text-muted bg-gh-bg-secondary inline-block px-2 py-1 rounded">
          Created: {new Date(experiment.created_at).toLocaleString()}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Logs Column */}
        <div className="flex-1 space-y-6">
          <h2 className="text-lg font-medium text-gh-text">Experiment Logs</h2>
          {logs.length === 0 && (
             <div className="p-8 text-center text-gh-text-muted border border-gh-border rounded-md border-dashed">
             No logs appended yet
           </div>
          )}
          <div className="space-y-4">
            {logs.map((log) => (
              <Card key={log.id}>
                <CardHeader 
                  title={`Log recorded at ${new Date(log.created_at).toLocaleString()}`} 
                  className="bg-gh-bg-secondary text-gh-text-muted text-xs border-b border-gh-border" 
                />
                <CardBody className="space-y-4 text-sm bg-gh-bg">
                  <div>
                    <strong className="block text-gh-text mb-1">Procedure:</strong>
                    <div className="text-gh-text-muted whitespace-pre-wrap">{log.procedure}</div>
                  </div>
                  <div className="border-t border-gh-border pt-4">
                    <strong className="block text-gh-text mb-1">Observations:</strong>
                    <div className="text-gh-text-muted whitespace-pre-wrap">{log.observations}</div>
                  </div>
                  <div className="border-t border-gh-border pt-4">
                    <strong className="block text-gh-text mb-1">Outcome:</strong>
                    <div className="text-gh-text-muted whitespace-pre-wrap">{log.outcome}</div>
                  </div>

                  {/* ===== Attachment ===== */}
                  <div className="mt-4 pt-4 border-t border-gh-border flex items-center justify-between">
                    {log.attachment_url ? (
                      <a href={log.attachment_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-gh-link hover:underline text-sm font-medium">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16"><path d="M2.75 14A1.75 1.75 0 0 1 1 12.25v-2.5a.75.75 0 0 1 1.5 0v2.5c0 .138.112.25.25.25h10.5a.25.25 0 0 0 .25-.25v-2.5a.75.75 0 0 1 1.5 0v2.5A1.75 1.75 0 0 1 13.25 14Z"></path><path d="M7.25 7.689V2a.75.75 0 0 1 1.5 0v5.689l1.97-1.969a.749.749 0 1 1 1.06 1.06l-3.25 3.25a.749.749 0 0 1-1.06 0L4.22 6.78a.749.749 0 1 1 1.06-1.06l1.97 1.969Z"></path></svg>
                        View Attachment
                      </a>
                    ) : (
                      canWrite && (
                        <div className="flex items-center gap-3 w-full">
                          <input
                            type="file"
                            onChange={(e) => setSelectedFiles({ ...selectedFiles, [log.id]: e.target.files[0] })}
                            className="text-sm bg-gh-bg-secondary text-gh-text border border-gh-border rounded px-2 py-1 file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gh-bg file:text-gh-text hover:file:bg-gh-border-active flex-1"
                          />
                          <Button
                            variant="primary"
                            onClick={async () => {
                              const file = selectedFiles[log.id];
                              if (!file) return;
                              await uploadLogAttachment(log.id, file);
                              setLogs(await fetchLogsByExperiment(id));
                            }}
                          >
                            Upload
                          </Button>
                        </div>
                      )
                    )}
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>

        {/* Sidebar / Add Log Column */}
        {canWrite && (
          <div className="w-full lg:w-80 shrink-0">
            <div className="sticky top-6">
              <Card>
                <CardHeader title="Append Log Entry" className="bg-gh-bg-secondary" />
                <CardBody className="bg-gh-bg">
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      await addExperimentLog(id, { procedure, observations, outcome });
                      setLogs(await fetchLogsByExperiment(id));
                      setProcedure("");
                      setObservations("");
                      setOutcome("");
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gh-text mb-1">Procedure</label>
                      <textarea
                        className="w-full bg-gh-bg-secondary border border-gh-border rounded-md px-3 py-2 text-sm text-gh-text focus:outline-none focus:border-gh-blue focus:ring-1 focus:ring-gh-blue resize-y h-20"
                        value={procedure}
                        onChange={(e) => setProcedure(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gh-text mb-1">Observations</label>
                      <textarea
                        className="w-full bg-gh-bg-secondary border border-gh-border rounded-md px-3 py-2 text-sm text-gh-text focus:outline-none focus:border-gh-blue focus:ring-1 focus:ring-gh-blue resize-y h-20"
                        value={observations}
                        onChange={(e) => setObservations(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gh-text mb-1">Outcome</label>
                      <input
                        className="w-full bg-gh-bg-secondary border border-gh-border rounded-md px-3 py-2 text-sm text-gh-text focus:outline-none focus:border-gh-blue focus:ring-1 focus:ring-gh-blue"
                        value={outcome}
                        onChange={(e) => setOutcome(e.target.value)}
                        required
                      />
                    </div>
                    <Button variant="primary" className="w-full justify-center">
                      Append Log
                    </Button>
                  </form>
                </CardBody>
              </Card>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
}
