// src/pages/UploadPage.js
import React, { useState } from "react";
import { uploadVideo } from "../services/api";
import {
  Container,
  Typography,
  Button,
  Box,
  Alert,
  LinearProgress,
  Paper,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

function UploadPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [status, setStatus] = useState({ message: "", type: "" });
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setStatus({ message: "", type: "" });
    setUploadProgress(0);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setStatus({ message: "Please select a file first.", type: "error" });
      return;
    }

    setStatus({
      message: "Uploading and processing... This may take a while.",
      type: "info",
    });

    try {
      await uploadVideo(selectedFile, (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setUploadProgress(percentCompleted);
      });
      setStatus({
        message:
          "Upload complete! The video is now being analyzed. Incidents will appear on the dashboard.",
        type: "success",
      });
    } catch (error) {
      setStatus({
        message: "Upload failed. Please check the server and try again.",
        type: "error",
      });
      console.error("Upload error:", error);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ padding: 4, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Upload Surveillance Footage
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
          Select a video file to begin the post-event analysis.
        </Typography>

        <Button
          variant="contained"
          component="label"
          startIcon={<CloudUploadIcon />}
          sx={{ mb: 2 }}
        >
          Select Video File
          <input
            type="file"
            hidden
            accept="video/*"
            onChange={handleFileChange}
          />
        </Button>

        {selectedFile && (
          <Typography variant="body2" sx={{ mb: 2 }}>
            File selected: <strong>{selectedFile.name}</strong>
          </Typography>
        )}

        <Button
          variant="contained"
          color="primary"
          onClick={handleUpload}
          disabled={!selectedFile || status.type === "info"}
          size="large"
        >
          Start Analysis
        </Button>

        {status.type === "info" && (
          <Box sx={{ width: "100%", mt: 4 }}>
            <LinearProgress variant="determinate" value={uploadProgress} />
            <Typography variant="body2" sx={{ mt: 1 }}>
              {uploadProgress}%
            </Typography>
          </Box>
        )}

        {status.message && (
          <Alert severity={status.type} sx={{ mt: 4, textAlign: "left" }}>
            {status.message}
          </Alert>
        )}
      </Paper>
    </Container>
  );
}

export default UploadPage;
