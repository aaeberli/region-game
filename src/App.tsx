import React from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AdminPage from "./pages/AdminPage";
import GamePage from "./pages/GamePage";
import CalibratePage from "./pages/CalibratePage";
import "./index.css";

function checkStorage() {
  try {
    localStorage.setItem("__ptg_test__", "1");
    localStorage.removeItem("__ptg_test__");
    return true;
  } catch {
    return false;
  }
}

const StorageWarning: React.FC = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-red-50 px-6">
    <div className="max-w-sm text-center rounded-2xl bg-white shadow-lg p-8">
      <p className="text-2xl mb-3">warning</p>
      <h2 className="text-lg font-bold text-red-700 mb-2">Storage Unavailable</h2>
      <p className="text-sm text-gray-600">
        This app requires localStorage. You may be in Private Browsing mode or storage is blocked.
      </p>
    </div>
  </div>
);

function App() {
  if (!checkStorage()) return <StorageWarning />;
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/game" element={<GamePage />} />
        <Route path="/calibrate" element={<CalibratePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
