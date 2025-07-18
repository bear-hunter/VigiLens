// frontend/src/pages/IncidentReviewPage.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getIncidentById } from "../services/api";
import { BsClock, BsCameraVideo, BsQuestionCircle } from "react-icons/bs"; // Using react-icons
import "./IncidentReviewPage.css"; // We will create this CSS file next

// A simple, native video player component
const SimpleVideoPlayer = ({ url }) => {
  if (!url) return <div className="video-placeholder">Loading...</div>;
  return (
    <video controls width="100%" autoPlay muted playsInline key={url}>
      <source src={url} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
};

function IncidentReviewPage() {
  const { id } = useParams(); // Gets the ':id' from the URL
  const [incident, setIncident] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIncident = async () => {
      try {
        setLoading(true);
        const response = await getIncidentById(id);
        setIncident(response.data);
      } catch (err) {
        setError("Failed to fetch incident details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchIncident();
    }
  }, [id]);

  if (loading)
    return <div className="status-message">Loading incident data...</div>;
  if (error) return <div className="status-message error">{error}</div>;
  if (!incident)
    return <div className="status-message">Incident not found.</div>;

  const formattedTimestamp = new Date(incident.timestamp).toLocaleString();

  return (
    <div className="review-page">
      <h1 className="review-title">Reviewing Incident #{incident.id}</h1>

      <div className="details-card">
        <div className="details-item">
          <BsClock />
          <span>{`Time: ${formattedTimestamp}`}</span>
        </div>
        <div className="details-item">
          <BsCameraVideo />
          <span>{`Camera ID: ${incident.camera_id}`}</span>
        </div>
        <div className="details-item">
          <BsQuestionCircle />
          <span>{`Tracker ID: ${incident.tracker_id}`}</span>
        </div>
      </div>

      <div className="video-grid">
        <div className="video-container">
          <h3>Original Footage</h3>
          <SimpleVideoPlayer url={incident.original_clip_url} />
        </div>
        <div className="video-container">
          <h3>AI-Annotated Footage</h3>
          <SimpleVideoPlayer url={incident.annotated_clip_url} />
        </div>
      </div>
    </div>
  );
}

export default IncidentReviewPage;
