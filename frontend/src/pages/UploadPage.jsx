import React, { useState, useRef } from 'react';
import './UploadPage.css';
import { FiX } from 'react-icons/fi'; // Using a nice 'X' icon for removing

const UploadPage = () => {
  // --- CHANGE 1: State is now an array to hold multiple files ---
  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileInputRef = useRef(null);

  const handleSelectClick = () => {
    fileInputRef.current.click();
  };

  // --- CHANGE 2: Handle multiple incoming files and add them to the state ---
  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files); // Convert FileList to a true array
    if (newFiles.length > 0) {
      // Append new files to the existing list
      setSelectedFiles(prevFiles => [...prevFiles, ...newFiles]);
    }
  };

  // --- CHANGE 3: Remove a specific file from the array by its index ---
  const handleRemoveFile = (indexToRemove) => {
    setSelectedFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove));
  };

  const handleStartAnalysis = () => {
    if (selectedFiles.length === 0) return;
    
    const fileNames = selectedFiles.map(file => file.name).join(', ');
    console.log('Starting analysis for:', fileNames);
    alert(`Starting analysis for ${selectedFiles.length} file(s): ${fileNames}`);
  };

  return (
    <div className="upload-page">
      <h1 className="page-header-title">Analyze the Incident</h1>

      {/* --- CHANGE 4: Add the 'multiple' attribute to the input --- */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        accept="video/mp4"
        multiple // This allows selecting multiple files
      />

      {selectedFiles.length === 0 ? (
        // State 1: No files are selected
        <>
          <h2 className="upload-instruction">
            Select video(s) to begin post-event analysis
          </h2>
          <div className="button-container">
            <button
              className="upload-btn select-btn"
              onClick={handleSelectClick}
            >
              Select Video Files
            </button>
            <button className="upload-btn" disabled={true}>
              Start Analysis
            </button>
          </div>
        </>
      ) : (
        // State 2: One or more files are selected
        <>
          {/* --- CHANGE 5: Display a scrollable list of files --- */}
          <div className="file-list-container">
            {selectedFiles.map((file, index) => (
              <div key={`${file.name}-${index}`} className="file-list-item">
                <span className="file-list-name">{file.name}</span>
                <button 
                  className="remove-file-btn" 
                  onClick={() => handleRemoveFile(index)}
                  aria-label={`Remove ${file.name}`}
                >
                  <FiX />
                </button>
              </div>
            ))}
          </div>

          <div className="button-container">
            {/* Add a button to select more files */}
            <button
              className="upload-btn select-more-btn"
              onClick={handleSelectClick}
            >
              Add More Files
            </button>
            <button
              className="upload-btn analyze-btn"
              onClick={handleStartAnalysis}
            >
              Start Analysis ({selectedFiles.length})
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default UploadPage;