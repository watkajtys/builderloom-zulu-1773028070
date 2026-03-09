import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { SystemHealth } from './components/SystemHealth';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div className="min-h-screen bg-[#050505] text-white flex items-center justify-center"><h1 className="text-4xl font-bold">Loom Initialized</h1></div>} />
        <Route element={<Layout />}>
          <Route path="/system-health" element={<SystemHealth />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}
