import React, { useState, useRef } from 'react';
import { generateVideoThumbnail } from '../services/videoUtils.js';
import './UploadPage.css';
import { FiVideo, FiX } from 'react-icons/fi';

const UploadPage = () => {
  // State holds an array of objects: { file, thumbnailSrc }
  const [filesData, setFilesData] = useState([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef(null);

  // This function processes new files from either drag-drop or selection
  const processFiles = async (newFiles) => {
    const fileList = Array.from(newFiles).filter(file => file.type.startsWith('video/'));
    if(fileList.length === 0) return;

    // Create initial state with a 'loading' status for thumbnails
    const initialData = fileList.map(file => ({ file, thumbnailSrc: 'loading' }));
    setFilesData(prevData => [...prevData, ...initialData]);

    // Generate thumbnails for the new files
    for (const file of fileList) {
      try {
        const thumb = await generateVideoThumbnail(file);
        // Update the specific file's data with the generated thumbnail
        setFilesData(prevData => prevData.map(data => 
          data.file === file ? { ...data, thumbnailSrc: thumb } : data
        ));
      } catch (error) {
        console.error("Error generating thumbnail for", file.name, error);
        // Update state to show an error or a default thumbnail
        setFilesData(prevData => prevData.map(data => 
          data.file === file ? { ...data, thumbnailSrc: 'error' } : data
        ));
      }
    }
  };
  
  const handleDrag = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragActive(true); };
  const handleDragLeave = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragActive(false); };
  const handleDrop = (e) => {
    e.preventDefault(); e.stopPropagation(); setIsDragActive(false);
    if (e.dataTransfer.files) processFiles(e.dataTransfer.files);
  };

  const handleFileChange = (e) => {
    if (e.target.files) processFiles(e.target.files);
    // Reset file input to allow selecting the same file again after removing it
    e.target.value = null;
  };
  
  const handleRemoveFile = (indexToRemove) => {
    setFilesData(prevData => prevData.filter((_, index) => index !== indexToRemove));
  };
  
  const handleSelectClick = () => fileInputRef.current.click();
  
  const handleAnalyze = () => {
    alert(`Analyzing ${filesData.length} file(s).`);
  };

  return (
    <div className="upload-page-container">
      <div className="upload-box">
        {/* The 'multiple' attribute is key for batch selection */}
        <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} accept="video/*" multiple />
        <div className="upload-header"><h3>Upload a video to analyze</h3></div>
        <div className="upload-body">
          {filesData.length === 0 ? (
            // State 1: No files selected -> Show drag & drop zone
            <div className={`drag-drop-zone ${isDragActive ? 'active' : ''}`} onDragEnter={handleDrag} onDragOver={handleDrag} onDragLeave={handleDragLeave} onDrop={handleDrop}>
              <div className="drag-drop-icon"><FiVideo /></div>
              <p>Drag and drop video file(s) to upload</p>
            </div>
          ) : (
            // State 2: Files are selected -> Show scrollable list with thumbnails
            <div className="file-list-container">
              {filesData.map((data, index) => (
                <div key={`${data.file.name}-${index}`} className="file-list-item">
                  <div className="thumbnail-container">
                    {data.thumbnailSrc === 'loading' && <div className="thumbnail-loading-spinner"></div>}
                    {data.thumbnailSrc !== 'loading' && data.thumbnailSrc !== 'error' && <img src={data.thumbnailSrc} alt={data.file.name} className="thumbnail-preview" />}
                    {data.thumbnailSrc === 'error' && <div className="thumbnail-error"><FiVideo/></div>}
                  </div>
                  <span className="file-list-name">{data.file.name}</span>
                  <button className="remove-file-btn" onClick={() => handleRemoveFile(index)}><FiX /></button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="upload-footer">
          <button className="page-btn select-btn" onClick={handleSelectClick}>
            {filesData.length === 0 ? 'Select Video Files' : 'Add More Files'}
          </button>
          <button className="page-btn analyze-btn" onClick={handleAnalyze} disabled={filesData.length === 0}>
            Analyze ({filesData.length})
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;