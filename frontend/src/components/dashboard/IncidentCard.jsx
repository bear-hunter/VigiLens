import React from 'react';
import './IncidentCard.css'; // Import the CSS

// Using 'react-icons/bs' for Bootstrap Icons which look similar
import { BsClock, BsCameraVideo } from 'react-icons/bs';

// The component takes data as props
const IncidentCard = ({ id, timestamp, cameraName, imageUrl }) => {
  return (
    <div className="incident-card">
      <div className="incident-image-placeholder">
        {imageUrl ? (
          <img src={imageUrl} alt={`Incident ${id}`} className="incident-image" />
        ) : (
          <span>{`Preview for Incident ${id}`}</span>
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
        
        <button className="review-button">REVIEW INCIDENT</button>
      </div>
    </div>
  );
};

export default IncidentCard;