// frontend/vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy all requests starting with /api to the backend server
      "/api": {
        target: "http://127.0.0.1:5000",
        changeOrigin: true,
      },
      // Proxy all requests starting with /processed to the backend server
      "/processed": {
        target: "http://127.0.0.1:5000",
        changeOrigin: true,
      },
    },
  },
});
