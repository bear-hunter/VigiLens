// src/pages/IncidentReviewPage.js
import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { getIncidentById } from "../services/api";
import {
  Container,
  Typography,
  Grid,
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

  // Refs for controlling video players simultaneously
  const player1Ref = useRef(null);
  const player2Ref = useRef(null);

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

  // Handlers for synchronized playback
  const handlePlay = () => {
    player1Ref.current?.seekTo(player1Ref.current.getCurrentTime(), "seconds");
    player2Ref.current?.seekTo(player1Ref.current.getCurrentTime(), "seconds");
    player1Ref.current?.getInternalPlayer()?.play();
    player2Ref.current?.getInternalPlayer()?.play();
  };

  const handlePause = () => {
    player1Ref.current?.getInternalPlayer()?.pause();
    player2Ref.current?.getInternalPlayer()?.pause();
  };

  const handleSeek = (seconds) => {
    player1Ref.current?.seekTo(seconds, "seconds");
    player2Ref.current?.seekTo(seconds, "seconds");
  };

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

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom align="center">
            Original Footage
          </Typography>
          <VideoPlayer
            ref={player1Ref}
            url={incident.original_clip_url}
            onPlay={handlePlay}
            onPause={handlePause}
            onSeek={handleSeek}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" gutterBottom align="center">
            AI-Annotated Footage
          </Typography>
          <VideoPlayer
            ref={player2Ref}
            url={incident.annotated_clip_url}
            onPlay={handlePlay}
            onPause={handlePause}
            onSeek={handleSeek}
          />
        </Grid>
      </Grid>
    </Container>
  );
}

export default IncidentReviewPage;
