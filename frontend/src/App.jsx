import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import your page components
import DashboardPage from './pages/DashboardPage.jsx'; // Good practice to add .jsx here too
import IncidentReviewPage from './pages/IncidentReviewPage.jsx';
import UploadPage from './pages/UploadPage.jsx';

// Import the Navbar component with the correct extension
import Navbar from './components/layout/Navbar.jsx';

// Import a CSS file for the main layout
import './App.css'; 

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/review" element={<IncidentReviewPage />} />
            <Route path="/upload" element={<UploadPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;