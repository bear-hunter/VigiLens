import React, { useState, useRef } from 'react';
import './UploadPage.css';

const UploadPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleSelectClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleStartAnalysis = () => {
    if (!selectedFile) {
      alert('Please select a video file first!');
      return;
    }
    console.log('Starting analysis for:', selectedFile.name);
    alert(`Starting analysis for: ${selectedFile.name}`);
  };

  return (
    <div className="upload-page">
      {/* --- THIS IS THE NEW TITLE --- */}
      <h1 className="page-header-title">Analyze the Incident</h1>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        accept="video/mp4"
      />

      {/* Changed this to an h2 and gave it a new class name */}
      <h2 className="upload-instruction">
        Select a video to begin post-event analysis
      </h2>

      <div className="button-container">
        <button
          className="upload-btn select-btn"
          onClick={handleSelectClick}
        >
          Select Video File
        </button>
        <button
          className="upload-btn analyze-btn"
          onClick={handleStartAnalysis}
          disabled={!selectedFile}
        >
          Start Analysis
        </button>
      </div>

      {selectedFile && (
        <p className="file-info">
          Selected: <strong>{selectedFile.name}</strong>
        </p>
      )}
    </div>
  );
};

export default UploadPage;