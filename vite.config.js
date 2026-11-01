import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // BACKEND: once your API exists, uncomment to avoid CORS during development.
    // Then set VITE_API_URL=/api in .env
    // proxy: { "/api": { target: "http://localhost:5000", changeOrigin: true } },
  },
});
