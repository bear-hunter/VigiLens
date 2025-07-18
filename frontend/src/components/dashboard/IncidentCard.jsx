// frontend/src/components/dashboard/IncidentCard.jsx
import React from "react";
import { Link } from "react-router-dom"; // Import Link
import "./IncidentCard.css";
import { BsClock, BsCameraVideo } from "react-icons/bs";

const IncidentCard = ({ id, timestamp, cameraName, imageUrl }) => {
  return (
    // The entire card is a Link component that navigates to the review page
    <Link to={`/incident/${id}`} className="incident-card-link">
      <div className="incident-image-placeholder">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={`Incident ${id}`}
            className="incident-image"
          />
        ) : (
          <span>Preview Unavailable</span>
        )}
      </div>
      <div className="incident-content">
        <h3>Incident #{id}</h3>

        <div className="info-item">
          <BsClock className="info-icon" />
          <span>{timestamp}</span>
        </div>

        <div className="info-item">
          <BsCameraVideo className="info-icon" />
          <span>Camera: {cameraName}</span>
        </div>

        <div className="review-button">REVIEW INCIDENT</div>
      </div>
    </Link>
  );
};

export default IncidentCard;
