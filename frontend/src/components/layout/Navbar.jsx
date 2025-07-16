// src/components/layout/Navbar.js
import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";

function Navbar() {
  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar>
        <VisibilityIcon
          sx={{ mr: 2, color: "primary.main", fontSize: "2rem" }}
        />
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, fontWeight: "bold" }}
        >
          VigiLens
        </Typography>
        <Box>
          <Button color="inherit" component={RouterLink} to="/">
            Incident Dashboard
          </Button>
          <Button color="inherit" component={RouterLink} to="/upload">
            Upload Video
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
