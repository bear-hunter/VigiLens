// src/services/api.js
import axios from "axios";

// The base URL for your Flask backend.
// During development, both servers (React & Flask) run on localhost.
const API_BASE_URL = "http://127.0.0.1:5000/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Uploads a video file for processing.
 * @param {File} file The video file to upload.
 * @param {Function} onUploadProgress A callback to track upload progress.
 * @returns {Promise} The response from the server.
 */
export const uploadVideo = (file, onUploadProgress) => {
  const formData = new FormData();
  formData.append("video", file);

  return apiClient.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress,
  });
};

/**
 * Fetches all detected incidents from the backend.
 * @returns {Promise<Array>} A list of incidents.
 */
export const getIncidents = () => {
  return apiClient.get("/incidents");
};

/**
 * Fetches the details for a single incident by its ID.
 * @param {string|number} id The ID of the incident.
 * @returns {Promise<Object>} The detailed incident data.
 */
export const getIncidentById = (id) => {
  return apiClient.get(`/incidents/${id}`);
};
