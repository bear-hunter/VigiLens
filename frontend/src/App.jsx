// frontend/src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Import your page components
import DashboardPage from "./pages/DashboardPage.jsx";
import IncidentReviewPage from "./pages/IncidentReviewPage.jsx";
import UploadPage from "./pages/UploadPage.jsx";

// Import the Navbar component with the correct extension
import Navbar from "./components/layout/Navbar.jsx";

// Import a CSS file for the main layout
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            {/* THIS IS A CRITICAL FIX - USE THE CORRECT PATH */}
            <Route path="/incident/:id" element={<IncidentReviewPage />} />
            <Route path="/upload" element={<UploadPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
