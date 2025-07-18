// frontend/src/pages/UploadPage.jsx
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { generateVideoThumbnail } from "../services/videoUtils.js";
import { uploadVideo } from "../services/api.js"; // <-- Import our API uploader
import "./UploadPage.css";
import { FiVideo, FiX } from "react-icons/fi";

const UploadPage = () => {
  const [filesData, setFilesData] = useState([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate(); // Hook for navigation

  const processFiles = async (newFiles) => {
    const fileList = Array.from(newFiles).filter((file) =>
      file.type.startsWith("video/")
    );
    if (fileList.length === 0) return;
    const initialData = fileList.map((file) => ({
      file,
      thumbnailSrc: "loading",
    }));
    setFilesData((prevData) => [...prevData, ...initialData]);
    for (const file of fileList) {
      try {
        const thumb = await generateVideoThumbnail(file);
        setFilesData((prevData) =>
          prevData.map((data) =>
            data.file === file ? { ...data, thumbnailSrc: thumb } : data
          )
        );
      } catch (error) {
        console.error("Error generating thumbnail for", file.name, error);
        setFilesData((prevData) =>
          prevData.map((data) =>
            data.file === file ? { ...data, thumbnailSrc: "error" } : data
          )
        );
      }
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files) processFiles(e.dataTransfer.files);
  };

  const handleFileChange = (e) => {
    if (e.target.files) processFiles(e.target.files);
    e.target.value = null;
  };

  const handleRemoveFile = (indexToRemove) => {
    setFilesData((prevData) =>
      prevData.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleSelectClick = () => fileInputRef.current.click();

  // --- THIS IS THE UPDATED FUNCTION ---
  const handleAnalyze = async () => {
    if (filesData.length === 0) return;

    // For simplicity, we'll upload files one by one.
    // In a real app, you might use Promise.all for parallel uploads.
    for (const data of filesData) {
      try {
        console.log(`Uploading ${data.file.name}...`);
        await uploadVideo(data.file, (progressEvent) => {
          // You can add a progress bar here later if you want
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log(
            `Upload progress for ${data.file.name}: ${percentCompleted}%`
          );
        });
        console.log(`${data.file.name} uploaded successfully.`);
      } catch (error) {
        console.error(`Failed to upload ${data.file.name}`, error);
        alert(
          `An error occurred while uploading ${data.file.name}. Please check the console.`
        );
      }
    }

    // After all uploads are done, show a confirmation and navigate to the dashboard
    alert(
      "All files have been uploaded for analysis. You will now be redirected to the dashboard."
    );
    navigate("/"); // Navigate back to the dashboard page
  };

  return (
    <div className="upload-page-container">
      <div className="upload-box">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
          accept="video/*"
          multiple
        />
        <div className="upload-header">
          <h3>Upload a video to analyze</h3>
        </div>
        <div className="upload-body">
          {filesData.length === 0 ? (
            <div
              className={`drag-drop-zone ${isDragActive ? "active" : ""}`}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="drag-drop-icon">
                <FiVideo />
              </div>
              <p>Drag and drop video file(s) to upload</p>
            </div>
          ) : (
            <div className="file-list-container">
              {filesData.map((data, index) => (
                <div
                  key={`${data.file.name}-${index}`}
                  className="file-list-item"
                >
                  <div className="thumbnail-container">
                    {data.thumbnailSrc === "loading" && (
                      <div className="thumbnail-loading-spinner"></div>
                    )}
                    {data.thumbnailSrc !== "loading" &&
                      data.thumbnailSrc !== "error" && (
                        <img
                          src={data.thumbnailSrc}
                          alt={data.file.name}
                          className="thumbnail-preview"
                        />
                      )}
                    {data.thumbnailSrc === "error" && (
                      <div className="thumbnail-error">
                        <FiVideo />
                      </div>
                    )}
                  </div>
                  <span className="file-list-name">{data.file.name}</span>
                  <button
                    className="remove-file-btn"
                    onClick={() => handleRemoveFile(index)}
                  >
                    <FiX />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="upload-footer">
          <button className="page-btn select-btn" onClick={handleSelectClick}>
            {filesData.length === 0 ? "Select Video Files" : "Add More Files"}
          </button>
          <button
            className="page-btn analyze-btn"
            onClick={handleAnalyze}
            disabled={filesData.length === 0}
          >
            Analyze ({filesData.length})
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
