import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HealthDashboard } from './components/HealthDashboard';
import { Telemetry } from './components/Telemetry';
import { KanbanBoard } from './components/KanbanBoard';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Telemetry />} />
          <Route path="/system-health" element={<HealthDashboard />} />
          <Route path="/dashboard" element={<HealthDashboard />} />
          <Route path="/kanban" element={<KanbanBoard />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}
