import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Home from "../pages/Home";
import ReportForm from "../pages/ReportForm";
import MapView from "../pages/MapView";
import Privacy from "../pages/Privacy";
import Terms from "../pages/Terms";

export default function ProtectedApp() {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="flex">
      <Sidebar expanded={expanded} setExpanded={setExpanded} />
      <div
        className={`flex-grow transition-all duration-300 ${
          expanded ? "lg:ml-64" : "lg:ml-20"
        }`}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/report" element={<ReportForm />} />
          <Route path="/map" element={<MapView />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}
