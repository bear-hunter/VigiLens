import React from 'react';
import IncidentCard from '../components/dashboard/IncidentCard.jsx';
import { Link } from 'react-router-dom'; // Import Link
import { FiPlus } from 'react-icons/fi'; // Import Plus icon
import './DashboardPage.css';

const mockIncidents = [
  {
    id: 3,
    timestamp: '7/17/2025, 7:42:54 PM',
    cameraName: 'CAM-02-UPLOADED',
    imageUrl: null,
  },
  {
    id: 2,
    timestamp: '7/17/2025, 7:40:30 PM',
    cameraName: 'CAM-04-AISLE-3',
    imageUrl: null,
  },
  {
    id: 1,
    timestamp: '7/17/2025, 7:40:30 PM',
    cameraName: 'CAM-01-ENTRANCE',
    imageUrl: null,
  },
];

const DashboardPage = () => {
  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <h1 className="dashboard-title">Incident Dashboard</h1>
        <Link to="/upload" className="upload-button">
          <FiPlus />
          Upload
        </Link>
      </header>
      
      <div className="incidents-list">
        {mockIncidents.map((incident) => (
          <IncidentCard
            key={incident.id}
            id={incident.id}
            timestamp={incident.timestamp}
            cameraName={incident.cameraName}
            imageUrl={incident.imageUrl}
          />
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;