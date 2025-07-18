// frontend/src/services/api.js
import axios from "axios";

// The base URL is now a relative path.
// Vite will catch this and proxy it to http://127.0.0.1:5000/api
const API_BASE_URL = "/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

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

export const getIncidents = () => {
  return apiClient.get("/incidents");
};

export const getIncidentById = (id) => {
  return apiClient.get(`/incidents/${id}`);
};
