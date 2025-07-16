// src/pages/DashboardPage.js
import React, { useState, useEffect } from "react";
import { getIncidents } from "../services/api";
import {
  Container,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  Paper,
  Box,
} from "@mui/material";
import IncidentCard from "../components/dashboard/IncidentCard";

function DashboardPage() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const response = await getIncidents();
        setIncidents(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch incidents. The backend may be down.");
        setLoading(false);
        console.error(err);
      }
    };

    fetchIncidents();
    // Optional: poll for new incidents every 30 seconds
    const interval = setInterval(fetchIncidents, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" gutterBottom>
        Incident Dashboard
      </Typography>
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", my: 5 }}>
          <CircularProgress />
        </Box>
      )}
      {error && <Alert severity="error">{error}</Alert>}
      {!loading && !error && (
        <>
          {incidents.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: "center", mt: 4 }}>
              <Typography variant="h6">No Incidents Detected</Typography>
              <Typography color="textSecondary">
                Upload a video to begin analysis.
              </Typography>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {incidents.map((incident) => (
                <Grid item key={incident.id} xs={12} sm={6} md={4} lg={3}>
                  <IncidentCard incident={incident} />
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}
    </Container>
  );
}

export default DashboardPage;
