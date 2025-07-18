// frontend/src/pages/IncidentReviewPage.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getIncidentById } from "../services/api";
import {
  Container,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Box,
  Chip,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import VideocamIcon from "@mui/icons-material/Videocam";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import VideoPlayer from "../components/review/VideoPlayer";

function IncidentReviewPage() {
  const { id } = useParams();
  const [incident, setIncident] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIncident = async () => {
      try {
        const response = await getIncidentById(id);
        setIncident(response.data);
      } catch (err) {
        setError("Failed to fetch incident details.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchIncident();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", my: 5 }}>
        <CircularProgress />
      </Box>
    );
  }
  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }
  if (!incident) {
    return <Alert severity="info">Incident not found.</Alert>;
  }

  const formattedTimestamp = new Date(incident.timestamp).toLocaleString();

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" gutterBottom>
        Reviewing Incident #{incident.id}
      </Typography>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6">Incident Details</Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 2 }}>
          <Chip
            icon={<AccessTimeIcon />}
            label={`Time: ${formattedTimestamp}`}
          />
          <Chip
            icon={<VideocamIcon />}
            label={`Camera ID: ${incident.camera_id}`}
          />
          <Chip
            icon={<HelpOutlineIcon />}
            label={`Tracker ID: ${incident.tracker_id}`}
          />
        </Box>
      </Paper>

      <hr />

      {/* Simplified Video Display Section */}
      <div>
        <Typography variant="h6" gutterBottom>
          Original Footage
        </Typography>
        <VideoPlayer url={incident.original_clip_url} />

        <br />

        <Typography variant="h6" gutterBottom>
          AI-Annotated Footage
        </Typography>
        <VideoPlayer url={incident.annotated_clip_url} />
      </div>
    </Container>
  );
}

export default IncidentReviewPage;
