import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProjectPage from "./pages/ProjectPage";
import ModulePage from "./pages/ModulePage";
import ExperimentPage from "./pages/ExperimentPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/projects/:id" element={<ProjectPage />} />
        <Route path="/modules/:id" element={<ModulePage />} />
        <Route path="/experiments/:id" element={<ExperimentPage />} />
      </Routes>
    </BrowserRouter>
  );
}
