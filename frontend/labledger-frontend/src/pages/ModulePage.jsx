import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Breadcrumb from "../components/layout/Breadcrumb";
import PageContainer from "../components/layout/PageContainer";
import { fetchExperimentsByModule, createExperiment } from "../api/experiment.api";
import { Card, CardBody } from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";

export default function ModulePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [module, setModule] = useState(null);
  const [experiments, setExperiments] = useState([]);
  const [error, setError] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newObjective, setNewObjective] = useState("");

  const loadExperiments = async () => {
    try {
      const data = await fetchExperimentsByModule(id);
      if (Array.isArray(data)) {
        setExperiments(data);
        if (!module) setModule({ id, name: "Module" }); 
      } else {
        setModule(data.module);
        setExperiments(data.experiments || []);
      }
    } catch {
      setError("Failed to load experiments");
    }
  };

  const handleCreateExperiment = async (e) => {
    e.preventDefault();
    try {
      if (!newTitle || !newObjective) return;
      await createExperiment(id, { title: newTitle, objective: newObjective });
      setShowNew(false);
      setNewTitle("");
      setNewObjective("");
      loadExperiments();
    } catch (err) {
      setError("Failed to create experiment");
    }
  };

  useEffect(() => {
    loadExperiments();
  }, [id]);

  if (error) return <PageContainer><div className="text-gh-danger">{error}</div></PageContainer>;
  if (!module) return <PageContainer><div className="text-gh-text-muted">Loading...</div></PageContainer>;

  return (
    <PageContainer>
      <Breadcrumb
        items={[
          { label: "Projects", to: "/dashboard" },
          { label: "Project", to: "#" },
          { label: module.name },
        ]}
      />

      <div className="mb-6 pb-4 border-b border-gh-border flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gh-text">{module.name}</h1>
        <Button variant="primary" onClick={() => setShowNew(!showNew)}>
          {showNew ? "Cancel" : "New Experiment"}
        </Button>
      </div>

      {showNew && (
        <Card className="mb-6">
          <CardBody className="bg-gh-bg-secondary p-5">
            <h2 className="text-lg font-medium text-gh-text mb-4">Create a new Experiment</h2>
            <form onSubmit={handleCreateExperiment} className="flex flex-col gap-4 max-w-md">
              <Input
                label="Trial / Experiment Title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
              />
              <Input
                label="Objective"
                value={newObjective}
                onChange={(e) => setNewObjective(e.target.value)}
                required
              />
              <div className="flex gap-2 mt-2">
                <Button type="submit" variant="primary">Create Experiment</Button>
                <Button type="button" variant="secondary" onClick={() => setShowNew(false)}>Cancel</Button>
              </div>
            </form>
          </CardBody>
        </Card>
      )}

      <h2 className="text-lg font-medium mb-3 text-gh-text mt-4">Experiments</h2>

      {experiments.length === 0 && (
        <div className="p-8 text-center text-gh-text-muted border border-gh-border rounded-md border-dashed">
          No experiments created yet
        </div>
      )}

      <div className="space-y-3">
        {experiments.map((exp) => (
          <Card key={exp.id} className="hover:border-gh-border-active transition-colors">
             <CardBody className="bg-gh-bg-secondary flex justify-between items-center">
               <div>
                 <Link to={`/experiments/${exp.id}`} className="text-gh-link font-medium hover:underline block mb-1">
                   {exp.title}
                 </Link>
                 <p className="text-sm text-gh-text-muted">{exp.objective}</p>
               </div>
               <Button variant="secondary" onClick={() => navigate(`/experiments/${exp.id}`)}>
                 Open
               </Button>
             </CardBody>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}
