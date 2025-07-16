// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {
  CssBaseline,
  ThemeProvider,
  createTheme,
  Container,
  Box,
} from "@mui/material";
import Navbar from "./components/layout/Navbar";
import DashboardPage from "./pages/DashboardPage";
import UploadPage from "./pages/UploadPage";
import IncidentReviewPage from "./pages/IncidentReviewPage";

// A professional dark theme for the security dashboard.
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#00c853", // A vibrant green for accents
    },
    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },
  },
  typography: {
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 600,
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        <Navbar />
        <Container component="main" maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
          <Box sx={{ paddingTop: "2rem" }}>
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/upload" element={<UploadPage />} />
              <Route path="/incident/:id" element={<IncidentReviewPage />} />
            </Routes>
          </Box>
        </Container>
      </Router>
    </ThemeProvider>
  );
}

export default App;
