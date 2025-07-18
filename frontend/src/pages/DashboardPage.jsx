// frontend/src/pages/DashboardPage.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiPlus } from "react-icons/fi";
import { getIncidents } from "../services/api";
import IncidentCard from "../components/dashboard/IncidentCard.jsx";
import "./DashboardPage.css";

const DashboardPage = () => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        setLoading(true);
        const response = await getIncidents();
        setIncidents(response.data);
      } catch (err) {
        setError("Failed to fetch incidents. Is the backend server running?");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchIncidents();
  }, []);

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <h1 className="dashboard-title">Incident Dashboard</h1>
        <Link to="/upload" className="upload-button">
          <FiPlus />
          Upload Video
        </Link>
      </header>

      <div className="incidents-list">
        {loading && <p>Loading incidents...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {!loading && !error && incidents.length === 0 && (
          <p>No incidents found. Upload a video to begin analysis.</p>
        )}
        {incidents.map((incident) => (
          <IncidentCard
            key={incident.id}
            id={incident.id}
            timestamp={new Date(incident.timestamp).toLocaleString()}
            cameraName={incident.camera_id}
            imageUrl={incident.thumbnail_url}
          />
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
