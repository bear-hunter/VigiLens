// src/components/dashboard/IncidentCard.js
import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  CardActions,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import VideocamIcon from "@mui/icons-material/Videocam";

function IncidentCard({ incident }) {
  // Format timestamp for display
  const formattedTimestamp = new Date(incident.timestamp).toLocaleString();

  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <CardMedia
        component="img"
        height="180"
        image={incident.thumbnail_url} // URL to the incident thumbnail from the backend
        alt={`Incident ${incident.id}`}
        sx={{ objectFit: "cover" }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5">
          Incident #{incident.id}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ display: "flex", alignItems: "center", mb: 1 }}
        >
          <AccessTimeIcon sx={{ mr: 1, fontSize: "1rem" }} />
          {formattedTimestamp}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ display: "flex", alignItems: "center" }}
        >
          <VideocamIcon sx={{ mr: 1, fontSize: "1rem" }} />
          Camera: {incident.camera_id}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          color="primary"
          variant="contained"
          component={RouterLink}
          to={`/incident/${incident.id}`}
        >
          Review Incident
        </Button>
      </CardActions>
    </Card>
  );
}

export default IncidentCard;
